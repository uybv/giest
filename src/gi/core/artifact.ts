import { ValueType } from './common';

const SUB_MAX_UP: number = 9;
const SUB_COUNT: number = 4;
const STAT_MAX_UP: number = SUB_MAX_UP - SUB_COUNT + 1;
const ARTIFACT_COUNT: number = 5;

export const SUB_VALUES: Record<ValueType, number> = {
  [ValueType.AtkFlat]: (13.62 + 15.56 + 17.51 + 19.45) / 4,
  [ValueType.AtkPercent]: (4.08 + 4.66 + 5.25 + 5.83) / 400,
  [ValueType.DefFlat]: (16.20 + 18.52 + 20.83 + 23.15) / 4,
  [ValueType.DefPercent]: (5.10 + 5.83 + 6.56 + 7.29) / 400,
  [ValueType.HpFlat]: (209.13 + 239.00 + 268.88 + 298.75) / 4,
  [ValueType.HpPercent]: (4.08 + 4.66 + 5.25 + 5.83) / 400,
  [ValueType.EmFlat]: (16.32 + 18.65 + 20.98 + 23.31) / 4,
  [ValueType.EmPercent]: 0,
  [ValueType.Er]: (4.53 + 5.18 + 5.83 + 6.48) / 400,
  [ValueType.CritRate]: (2.72 + 3.11 + 3.50 + 3.89) / 400,
  [ValueType.CritDmg]: (5.44 + 6.22 + 6.99 + 7.77) / 400,
  [ValueType.DmgBonus]: 0,
  [ValueType.PDmgBonus]: 0,
  [ValueType.HealBonus]: 0,
  [ValueType.FlatDmg]: 0,
  [ValueType.ResistanceReduction]: 0,
  [ValueType.DefReduction]: 0,
  [ValueType.DefIgnore]: 0,
  /*
  [ValueType.AtkFlat]: 17.51,
  [ValueType.AtkPercent]: 5.25 / 100,
  [ValueType.DefFlat]: 20.83,
  [ValueType.DefPercent]: 6.56 / 100,
  [ValueType.HpFlat]: 268.88,
  [ValueType.HpPercent]: 5.25 / 100,
  [ValueType.EmFlat]: 20.98,
  [ValueType.EmPercent]: 0,
  [ValueType.Er]: 5.83 / 100,
  [ValueType.CritRate]: 3.50 / 100,
  [ValueType.CritDmg]: 6.99 / 100,
  [ValueType.DmgBonus]: 0,
  [ValueType.PDmgBonus]: 0,
  [ValueType.HealBonus]: 0,
  [ValueType.FlatDmg]: 0,
  [ValueType.ResistanceReduction]: 0,
  [ValueType.DefReduction]: 0,
  [ValueType.DefIgnore]: 0,
  */
};

export const MAIN_VALUES: Record<ValueType, number> = {
  [ValueType.AtkFlat]: 311,
  [ValueType.AtkPercent]: 0.466,
  [ValueType.DefFlat]: 0,
  [ValueType.DefPercent]: 0.583,
  [ValueType.HpFlat]: 4780,
  [ValueType.HpPercent]: 0.466,
  [ValueType.EmFlat]: 186.5,
  [ValueType.EmPercent]: 0,
  [ValueType.Er]: 0.518,
  [ValueType.CritRate]: 0.311,
  [ValueType.CritDmg]: 0.622,
  [ValueType.DmgBonus]: 0.466,
  [ValueType.PDmgBonus]: 0.522,
  [ValueType.HealBonus]: 0,
  [ValueType.FlatDmg]: 0,
  [ValueType.ResistanceReduction]: 0,
  [ValueType.DefReduction]: 0,
  [ValueType.DefIgnore]: 0,
};
export type SubValueType = ValueType.AtkFlat | ValueType.AtkPercent | ValueType.DefFlat | ValueType.DefPercent | ValueType.HpFlat | ValueType.HpPercent | ValueType.EmFlat | ValueType.Er | ValueType.CritDmg | ValueType.CritRate | ValueType.DmgBonus;
export type FlowerValueType = ValueType.HpFlat;
export type PlumeValueType = ValueType.AtkFlat;
export type SandValueType = ValueType.HpPercent | ValueType.AtkPercent | ValueType.DefPercent | ValueType.EmFlat | ValueType.Er;
export type GobletValueType = ValueType.HpPercent | ValueType.AtkPercent | ValueType.DefPercent | ValueType.EmFlat | ValueType.DmgBonus | ValueType.PDmgBonus;
export type CircletValueType = ValueType.HpPercent | ValueType.AtkPercent | ValueType.DefPercent | ValueType.EmFlat | ValueType.CritRate | ValueType.CritDmg | ValueType.HealBonus;

export class Artifact {
  constructor(
    public flower: FlowerValueType = ValueType.HpFlat,
    public plume: PlumeValueType = ValueType.AtkFlat,
    public sand: SandValueType = ValueType.AtkPercent,
    public goblet: GobletValueType = ValueType.DmgBonus,
    public circlet: CircletValueType = ValueType.CritRate,
    public subUps: Record<SubValueType, number> = {
      [ValueType.AtkFlat]: 0,
      [ValueType.AtkPercent]: 0,
      [ValueType.DefFlat]: 0,
      [ValueType.DefPercent]: 0,
      [ValueType.HpFlat]: 0,
      [ValueType.HpPercent]: 0,
      [ValueType.EmFlat]: 0,
      [ValueType.Er]: 0,
      [ValueType.CritRate]: 0,
      [ValueType.CritDmg]: 0,
      [ValueType.DmgBonus]: 0
    }) {
  }

  public get subStatTypes(): SubValueType[] {
    return (Object.keys(this.subUps) as Array<SubValueType>)
      .filter(subType => this.subUps[subType] > 0)
      .sort((a, b) => {
        var aMaxUp = this.maxSubUpCount(a);
        var bmaxUp = this.maxSubUpCount(b);
        if (aMaxUp > bmaxUp) {
          return 1;
        } else if (aMaxUp < bmaxUp) {
          return -1;
        } else {
          if (this.subUps[a] > this.subUps[b]) {
            return 1;
          } else if (this.subUps[a] < this.subUps[b]) {
            return -1;
          }
        }
        return 0;
      });
  }

  public get isValid(): boolean {
    var subTypes = this.subStatTypes;
    if (subTypes.some(subType => this.subUps[subType] > this.maxSubUpCount(subType))) {
      return false;
    }
    return this.isSubValid(subTypes);
  }

  private mainStatCount(type: ValueType): number {
    return [this.flower, this.plume, this.sand, this.goblet, this.circlet].filter(sub => sub == type).length;
  }

  private subUpCount(type: ValueType): number {
    if (this.subStatTypes.some(sub => sub == type)) {
      return this.subUps[type as SubValueType];
    }
    return 0;
  }

  private maxSubUpCount(subType: SubValueType): number {
    return (ARTIFACT_COUNT - this.mainStatCount(subType)) * STAT_MAX_UP;
  }

  private isSubValid(subTypes: SubValueType[]): boolean {
    var subCountMax = SUB_COUNT > subTypes.length ? SUB_COUNT : subTypes.length;
    var coms = Array.from(Array(subCountMax).keys()).map(x => x + 1).map(cMax => {
      return this.getCombination([0], 1, cMax, subTypes.length);
    }).reduce((pre, cur) => [...pre, ...cur]);
    var isOk = coms.every(com => {
      var maxUp = (ARTIFACT_COUNT * SUB_MAX_UP) - ((SUB_COUNT - com.length) * ARTIFACT_COUNT) - com.map(idx => {
        return this.mainStatCount(subTypes[idx]);
      }).reduce((a, b) => a + b, 0);
      var currentUp = com.map(idx => this.subUpCount(subTypes[idx])).reduce((a, b) => a + b, 0);
      return maxUp >= currentUp;
    });
    return isOk;
  }

  private getCombination(locks: number[], h: number, k: number, n: number): number[][] {
    var result: number[][] = [];
    for (let i = locks[h-1] + 1; i <= n - (k-h); i++) {
      locks[h] = i;
      if (h == k) {
        result.push(locks.slice(1, k + 1).map(v => v - 1));
      } else {
        result.push(...this.getCombination(locks, h + 1, k, n));
      }
    }
    return result;
  }

  public getValue(type: ValueType): number {
    return this.mainStatCount(type) * MAIN_VALUES[type] + this.subUpCount(type) * SUB_VALUES[type];
  }
}
