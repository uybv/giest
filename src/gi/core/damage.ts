import { CircletValueType, GobletValueType, SandValueType, SubValueType } from './artifact';
import { ADDITIVE, AdditiveType, AMPLIFYING, AmplifyingType, LEVEL_MULTIPLIER, TRANSFORMATIVE } from './calculator';
import { Enemy } from './enemy';
import { Combo, IcdType, Simulator } from './simulator';

export class DamageResult {
  constructor(
    public sand: SandValueType,
    public goblet: GobletValueType,
    public circlet: CircletValueType,
    public subUps: Record<SubValueType, number>,
    public dmgNormal: number,
    public dmgCrit: number,
    public dmgAvg: number,
    public dmgCombo: number
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

  private calDmg(combo: Combo): number {
    let dmg = ((combo.baseDmg * this.simulator.specialMultiplier) + this.simulator.flatDmg + (combo.withReact ? this.additiveReaction : 0))
      * (1 + this.simulator.dmgBonus - this.enemy.damageReduction)
      * this.enemyDefMult
      * this.enemyResMult
      * (combo.withReact ? this.amplifyingReaction : 1)
      + (combo.withReact ? this.transformativeReaction : 0);
    return dmg * combo.hitCount;
  }

  private get coreDmg(): number {
    return this.calDmg({
      baseDmg: this.simulator.baseDmg,
      hitCount: 1,
      withReact: false
    });
  }
  private get coreDmgWithAddition(): number {
    return this.calDmg({
      baseDmg: this.simulator.baseDmg,
      hitCount: 1,
      withReact: true
    });
  }

  get dmgNormal(): number {
    if (this.simulator.icdType == IcdType.None) {
      return this.coreDmgWithAddition;
    } else if (this.simulator.icdType == IcdType.Normal) {
      return (this.coreDmg * 2 + this.coreDmgWithAddition) / 3;
    } else if (this.simulator.icdType == IcdType.Half) {
      return (this.coreDmg + this.coreDmgWithAddition) / 2;
    }
    return this.coreDmg;
  }
  get dmgCrit(): number {
    var dmgCrit = this.coreDmg * this.crit;
    var dmgCritWithAddition = this.coreDmgWithAddition * this.crit;

    if (this.simulator.icdType == IcdType.None) {
      return dmgCritWithAddition;
    } else if (this.simulator.icdType == IcdType.Normal) {
      return (dmgCrit * 2 + dmgCritWithAddition) / 3;
    } else if (this.simulator.icdType == IcdType.Half) {
      return (dmgCrit + dmgCritWithAddition) / 2;
    }

    return dmgCrit;
  }
  get dmgAvg(): number {
    var dmgAvg = this.coreDmg * this.critAvg;
    var dmgAvgWithAddition = this.coreDmgWithAddition * this.critAvg;

    if (this.simulator.icdType == IcdType.None) {
      return dmgAvgWithAddition;
    } else if (this.simulator.icdType == IcdType.Normal) {
      return (dmgAvg * 2 + dmgAvgWithAddition) / 3;
    } else if (this.simulator.icdType == IcdType.Half) {
      return (dmgAvg + dmgAvgWithAddition) / 2;
    }

    return dmgAvg;
  }

  get dmgCombo(): number {
    var totalDmg = this.simulator.combo
      .map(c => this.calDmg(c))
      .reduce((a, b) => a + b);
    return totalDmg * this.critAvg;
  }

}
