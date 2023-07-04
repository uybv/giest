import { Damage, DamageResult } from './core/damage';
import { Condition, ConditionValue, DmgType, OprType, ResultType, Simulator } from './core/simulator';
import { Ayaka } from './simulator/ayaka';
import { CharacterType } from './core/character';
import { ValueType } from './core/common';
import { CircletValueType, GobletValueType, SandValueType, SubValueType } from './core/artifact';
import { Xiao } from './simulator/xiao';
import { Miko } from './simulator/miko';
import { Nahida } from './simulator/nahida';
import { Alhaitham } from './simulator/alhaitham';

export class Estimate {

  constructor() {
  }

  public getSimulator(condition: Condition): Simulator {
    if (condition.character == CharacterType.KamisatoAyaka) {
      return new Ayaka(condition);
    } else if (condition.character == CharacterType.Xiao) {
      return new Xiao(condition);
    } else if (condition.character == CharacterType.YaeMiko) {
      return new Miko(condition);
    } else if (condition.character == CharacterType.Nahida) {
      return new Nahida(condition);
    } else if (condition.character == CharacterType.Alhaitham) {
      return new Alhaitham(condition);
    }
    throw new Error('Character not found.');
  }

  public calculate(condition: Condition): DamageResult[] {
    let simulator = this.getSimulator(condition);

    let cal = new Damage(simulator);
    let subs = this.getSubs(simulator, condition.artifacts.subUpCount);
    let mains = this.getMains(simulator);

    let results = mains.map(m => {
      simulator.character.artifact.sand = m.sand;
      simulator.character.artifact.goblet = m.goblet;
      simulator.character.artifact.circlet = m.circlet;
      return subs.map(sub => {
        simulator.character.artifact.subUps = sub;
        if (simulator.isValid && this.valid(simulator, condition.search.conditions)) {
          return new DamageResult(
            simulator.character.artifact.sand,
            simulator.character.artifact.goblet,
            simulator.character.artifact.circlet,
            sub,
            cal.dmgNormal,
            cal.dmgCrit,
            cal.dmgAvg
            );
        }
        return undefined;
      })
      .filter(r => r != undefined)
      .map(r => r as DamageResult);
    }).reduce((pre, cur) => [...pre, ...cur]);

    if (results.length > 0) {
      if (condition.search.resultType == ResultType.All) {
        if (condition.search.dmgType == DmgType.Crit) {
          return results.sort((a, b) => {
            if (a.dmgCrit > b.dmgCrit) {
              return -1;
            }
            return 0;
          }).slice(0, condition.results.count);
        } else if (condition.search.dmgType == DmgType.Avg) {
          return results.sort((a, b) => {
            if (a.dmgAvg > b.dmgAvg) {
              return -1;
            }
            return 0;
          }).slice(0, condition.results.count);
        }
      } else if (condition.search.resultType == ResultType.ByMain) {
        if (condition.search.dmgType == DmgType.Crit) {
          return mains.map(m => {
            let top = results
              .filter(r => r.sand == m.sand && r.goblet == m.goblet && r.circlet == m.circlet)
              .sort((a, b) => {
                if (a.dmgCrit > b.dmgCrit) {
                  return -1;
                }
                return 0;
              });
            return top[0];
          })
          .sort((a, b) => {
            if (a.dmgCrit > b.dmgCrit) {
              return -1;
            }
            return 0;
          });
        } else if (condition.search.dmgType == DmgType.Avg) {
          return mains.map(m => {
            let top = results
              .filter(r => r.sand == m.sand && r.goblet == m.goblet && r.circlet == m.circlet)
              .sort((a, b) => {
                if (a.dmgAvg > b.dmgAvg) {
                  return -1;
                }
                return 0;
              });
            return top[0];
          })
          .sort((a, b) => {
            if (a.dmgAvg > b.dmgAvg) {
              return -1;
            }
            return 0;
          });
        }
      }
    }

    return [];
  }

  private valid(simulator: Simulator, conditions: ConditionValue[]): boolean {
    return conditions.every(c => {
      if (c.type == ValueType.Er) {
        if (c.opr == OprType.Equal) return simulator.er == c.value;
        else if (c.opr == OprType.LT) return simulator.er <= c.value;
        else if (c.opr == OprType.GT) return simulator.er >= c.value;
        else return true;
      } else if (c.type == ValueType.CritRate) {
        if (c.opr == OprType.Equal) return simulator.rate == c.value;
        else if (c.opr == OprType.LT) return simulator.rate <= c.value;
        else if (c.opr == OprType.GT) return simulator.rate >= c.value;
        else return true;
      }
      return true;
    });
  }

  private getMains(simulator: Simulator): {
    sand: SandValueType,
    goblet: GobletValueType,
    circlet: CircletValueType
  }[] {
    return simulator.sandTypes.map(s => {
      return simulator.gobletTypes.map(g => {
        return simulator.circletTypes.map(c => {
          return {
            sand: s,
            goblet: g,
            circlet: c
          };
        });
      }).reduce((pre, cur) => [...pre, ...cur]);
    }).reduce((pre, cur) => [...pre, ...cur]);
  }

  private getSubs(simulator: Simulator, upCount: number): Record<SubValueType, number>[] {
    let list: number[][] = [];
    this.split(list, [], upCount, simulator.subStatTypes.length);
    return list.map(item => {
      let build: Record<SubValueType, number> = {
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
      };
      simulator.subStatTypes.forEach((subType, i) => {
        build[subType] = item[i];
      });
      return build;
    });
  }

  private split(result: number[][], snapArray: number[], sum: number, len: number): void {
    if (len == 2) {
      for (let i = 0; i <= sum; i++) {
        var snap = Object.assign([], snapArray);
        snap.push(i);
        snap.push(sum - i);
        result.push(snap);
      }
    } else {
      for (let i = 0; i <= sum; i++) {
        let snap = Object.assign([], snapArray);
        snap.push(i);
        this.split(result, snap, sum - i, len - 1);
      }
    }
  }

}
