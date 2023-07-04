import { CircletValueType, GobletValueType, SandValueType, SubValueType } from './artifact';
import { ADDITIVE, AdditiveType, AMPLIFYING, AmplifyingType, LEVEL_MULTIPLIER, TRANSFORMATIVE } from './calculator';
import { Enemy } from './enemy';
import { Simulator } from './simulator';

export class DamageResult {
  constructor(
    public sand: SandValueType,
    public goblet: GobletValueType,
    public circlet: CircletValueType,
    public subUps: Record<SubValueType, number>,
    public dmgNormal: number,
    public dmgCrit: number,
    public dmgAvg: number
    ) {
  }
}

export class Damage {
  constructor(
    public simulator: Simulator,
    public enemy: Enemy = new Enemy()
  ) {
  }

  private get enemyDefMult(): number {
    return (this.simulator.character.charLevel + 100) / ((this.simulator.character.charLevel + 100) + (this.enemy.level + 100) * (1 - this.simulator.defReduction) * (1 - this.simulator.defIgnore));
  }
  private get enemyResMult(): number {
    var res = this.enemy.resistance - this.simulator.resistanceReduction;
    if (res < 0) {
      return 1 - res / 2;
    } else if (res >= 0 && res < 0.75) {
      return 1 - res;
    } else {
      return 1 / (4 * res + 1);
    }
  }
  private get transformativeReaction(): number {
    return TRANSFORMATIVE[this.simulator.transformativeType] * LEVEL_MULTIPLIER[this.simulator.character.charLevel] * (1 + (16 * this.simulator.em) / (2000 + this.simulator.em) + this.simulator.reactionBonus) * this.enemyResMult;
  }
  private get amplifyingReaction(): number {
    return this.simulator.amplifyingType != AmplifyingType.None
      ? AMPLIFYING[this.simulator.amplifyingType] * (1 + (2.78 * this.simulator.em) / (1400 + this.simulator.em) + this.simulator.reactionBonus)
      : 1;
  }
  private get additiveReaction(): number {
    return this.simulator.additiveType != AdditiveType.None
      ? ADDITIVE[this.simulator.additiveType] * LEVEL_MULTIPLIER[this.simulator.character.charLevel] * (1 + (5 * this.simulator.em) / (1200 + this.simulator.em) + this.simulator.reactionBonus)
      : 0;
  }
  private get crit(): number {
    return 1 + this.simulator.crit;
  }
  private get critAvg(): number {
    return 1 + (this.simulator.crit * this.simulator.rate);
  }

  private get coreDmg(): number {
    return ((this.simulator.baseDmg * this.simulator.specialMultiplier) + this.simulator.flatDmg)
      * (1 + this.simulator.dmgBonus - this.enemy.damageReduction)
      * this.enemyDefMult
      * this.enemyResMult
      * this.amplifyingReaction
      + this.transformativeReaction;
  }
  private get coreDmgWithAddition(): number {
    return ((this.simulator.baseDmg * this.simulator.specialMultiplier) + this.simulator.flatDmg + this.additiveReaction)
      * (1 + this.simulator.dmgBonus - this.enemy.damageReduction)
      * this.enemyDefMult
      * this.enemyResMult
      * this.amplifyingReaction
      + this.transformativeReaction;
  }

  get dmgNormal(): number {
    return (this.coreDmg * 2 + this.coreDmgWithAddition) / 3;
  }
  get dmgCrit(): number {
    var dmgCrit = this.coreDmg * this.crit;
    var dmgCritWithAddition = this.coreDmgWithAddition * this.crit;
    return (dmgCrit * 2 + dmgCritWithAddition) / 3;
  }
  get dmgAvg(): number {
    var dmgAvg = this.coreDmg * this.critAvg;
    var dmgAvgWithAddition = this.coreDmgWithAddition * this.critAvg;
    return (dmgAvg * 2 + dmgAvgWithAddition) / 3;
  }

}
