import { CircletValueType, FlowerValueType, GobletValueType, PlumeValueType, SandValueType, SubValueType } from './artifact';
import { AdditiveType, AmplifyingType, TransformativeType } from './calculator';
import { Character, CharacterType } from './character';
import { ValueType } from './common';
import { WeaponType } from './weapon';

export enum DmgType {
  Avg = 'Avg',
  Crit = 'Crit',
};

export enum ResultType {
  All = 'All',
  ByMain = 'ByMain',
};

export enum OprType {
  LT = '<',
  GT = '>',
  Equal = '=',
};

export interface ConditionValue {
  type: ValueType;
  value: number;
  opr: OprType;
}

export interface Condition {
  character: CharacterType;
  characterLvl: number;
  weapon: WeaponType;
  weaponLvl: number;
  artifacts: {
    flowerTypes: FlowerValueType[],
    plumeTypes: PlumeValueType[],
    sandTypes: SandValueType[],
    gobletTypes: GobletValueType[],
    circletTypes: CircletValueType[],
    subUpCount: number
  },
  buffs: {
    type: ValueType,
    value: number,
    base: boolean,
  }[],
  search: {
    subStatTypes: SubValueType[],
    dmgType: DmgType,
    resultType: ResultType,
    conditions: ConditionValue[]
  },
  results: {
    count: number
  }
}

export interface ISimulator {
  get character(): Character;
  get condition(): Condition;

  get sandTypes(): SandValueType[];
  get gobletTypes(): GobletValueType[];
  get circletTypes(): CircletValueType[];
  get subStatTypes(): SubValueType[];

  get isValid(): boolean;

  get hp(): number;
  get atk(): number;
  get def(): number;
  get crit(): number;
  get rate(): number;
  get dmgBonus(): number;
  get er(): number;
  get em(): number;
  get flatDmg(): number;
  get specialMultiplier(): number;
  get defReduction(): number;
  get defIgnore(): number;
  get resistanceReduction(): number;
  get transformativeType(): TransformativeType;
  get reactionBonus(): number;
  get amplifyingType(): AmplifyingType;
  get additiveType(): AdditiveType;
  get baseDmg(): number;
}

export abstract class Simulator implements ISimulator {

  protected readonly buff: Record<ValueType, number> = {
    [ValueType.AtkFlat]: 0,
    [ValueType.AtkPercent]: 0,
    [ValueType.DefFlat]: 0,
    [ValueType.DefPercent]: 0,
    [ValueType.HpFlat]: 0,
    [ValueType.HpPercent]: 0,
    [ValueType.EmFlat]: 0,
    [ValueType.EmPercent]: 0,
    [ValueType.Er]: 0,
    [ValueType.CritRate]: 0,
    [ValueType.CritDmg]: 0,
    [ValueType.DmgBonus]: 0,
    [ValueType.PDmgBonus]: 0,
    [ValueType.HealBonus]: 0,
    [ValueType.FlatDmg]: 0,
    [ValueType.ResistanceReduction]: 0,
    [ValueType.DefReduction]: 0,
    [ValueType.DefIgnore]: 0
  };

  private _condition: Condition;
  private _character: Character;

  constructor(condition: Condition) {
    this._condition = condition;
    this._character = new Character(condition.character, condition.weapon, condition.characterLvl, condition.weaponLvl);
    condition.buffs.filter(b => b.base).forEach(b => {
      this.character.effect[b.type] += b.value;
    });
    condition.buffs.filter(b => !b.base).forEach(b => {
      this.buff[b.type] += b.value;
    });
  }

  get condition(): Condition {
    return this._condition;
  }

  get character(): Character {
    return this._character;
  }

  get isValid(): boolean {
    return this.character.isValid;
  }

  get hp(): number {
    return this.character.hp
      + this.buff.HpFlat
      + this.character.base.HpFlat * this.buff.HpPercent;
  }
  get atk(): number {
    let otherEffect = 0;
    if (this.character.weaponType == WeaponType.StaffOfHoma) {
      otherEffect += (this.hp * 0.8 / 100);
      //otherEffect += (this.hp * 1 / 100);
    }

    return this.character.atk
      + this.buff.AtkFlat
      + this.character.base.AtkFlat * this.buff.AtkPercent
      + otherEffect;
  }
  get def(): number {
    return this.character.def
      + this.buff.DefFlat
      + this.character.base.DefFlat * this.buff.DefPercent;
  }
  get crit(): number {
    return this.character.crit
      + this.buff.CritDmg;
  }
  get rate(): number {
    var rate = this.character.rate + this.buff.CritRate;
    return rate > 1 ? 1 : rate;
  }
  get dmgBonus(): number {
    return this.character.dmgBonus
      + this.buff.DmgBonus;
  }
  get er(): number {
    return this.character.er
      + this.buff.Er;
  }
  get em(): number {
    return this.character.em
      + this.buff.EmFlat
      + this.character.em * this.buff.EmPercent;
  }
  get flatDmg(): number {
    return this.character.effect.FlatDmg + this.buff.FlatDmg;
  }
  get specialMultiplier(): number {
    return 1;
  }
  get defReduction(): number {
    return this.character.base.DefReduction
      + this.character.effect.DefReduction
      + this.buff.DefReduction;
  }
  get defIgnore(): number {
    return this.character.base.DefIgnore
      + this.character.effect.DefIgnore
      + this.buff.DefIgnore;
  }
  get resistanceReduction(): number {
    return this.character.base.ResistanceReduction
      + this.character.effect.ResistanceReduction
      + this.buff.ResistanceReduction;
  }
  get reactionBonus(): number {
    return 0;
  }
  get transformativeType(): TransformativeType {
    return TransformativeType.None;
  }
  get amplifyingType(): AmplifyingType {
    return AmplifyingType.None;
  }
  get additiveType(): AdditiveType {
    return AdditiveType.None;
  }

  get sandTypes(): SandValueType[] {
    return this._condition.artifacts.sandTypes;
  }
  get gobletTypes(): GobletValueType[] {
    return this._condition.artifacts.gobletTypes;
  }
  get circletTypes(): CircletValueType[] {
    return this._condition.artifacts.circletTypes;
  }
  get subStatTypes(): SubValueType[] {
    return this._condition.search.subStatTypes;
  }

  abstract get baseDmg(): number;
}
