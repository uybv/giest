import * as genshindb from 'genshin-db';
import { Combo, Condition, IcdType, Simulator } from '@gi/core/simulator';
import { AdditiveType, AmplifyingType, TransformativeType } from '@gi/core/calculator';
import { WeaponType } from '@gi/core/weapon';

export class Alhaitham extends Simulator {

  constructor(condition: Condition) {
    super(condition);
  }

  get baseDmg(): number {
    let talents = genshindb.talents(this.character.charType);
    var talentParams = talents?.combat2.attributes.parameters;
    return this.atk * (talentParams != undefined ? talentParams["param8"][9] : 1.21) +
      this.em * (talentParams != undefined ? talentParams["param9"][9] : 2.42);
  }

  override get transformativeType(): TransformativeType {
    return TransformativeType.None;
  }
  override get amplifyingType(): AmplifyingType {
    return AmplifyingType.None;
  }
  override get additiveType(): AdditiveType {
    return AdditiveType.Spread;
  }
  override get icdType(): IcdType {
    return IcdType.Half;
  }

  override get dmgBonus(): number {
    let dmgBonus = this.em * 0.1 / 100;
    if (dmgBonus > 1) {
      dmgBonus = 1;
    }
    return super.dmgBonus + dmgBonus;
  }

  override get flatDmg(): number {
    let flatDmg = 0;
    if (this.character.weaponType == WeaponType.LightOfFoliarIncision) {
      flatDmg = this.em * 1.2;
    }
    return super.flatDmg + flatDmg;
  }

  override get combo(): Combo[] {
    let talents = genshindb.talents(this.character.charType);
    var skillA = talents?.combat1.attributes.parameters;
    var skillE = talents?.combat2.attributes.parameters;
    var skillQ = talents?.combat2.attributes.parameters;
    let Ea = this.atk * skillE!["param1"][9] + this.em * skillE!["param2"][9];

    let Eb1 = this.atk * skillE!["param4"][9] + this.em * skillE!["param5"][9]; // x1x2
    let Eb2 = this.atk * skillE!["param6"][9] + this.em * skillE!["param7"][9]; // x2x3
    let Eb3 = this.atk * skillE!["param8"][9] + this.em * skillE!["param9"][9]; // x3x3
    let Eb = (Eb1 * 2 + Eb2 * 3 + Eb3 * 3) / 8;

    let Qa = this.atk * skillQ!["param1"][9] + this.em * skillQ!["param2"][9]; // x4

    let CA = this.atk * (skillA!["param7"][9] + skillA!["param8"][9]) / 2;
    let NA = this.atk * (
      skillA!["param1"][9] +
      skillA!["param2"][9] +
      skillA!["param3"][9] +
      skillA!["param4"][9] +
      skillA!["param5"][9] +
      skillA!["param6"][9]) / 6;

    return [
      // E-A
      {
        baseDmg: Ea,
        hitCount: 1,
        withReact: true
      },
      // E-B
      {
        baseDmg: Eb,
        hitCount: 6,
        withReact: true
      },
      {
        baseDmg: Eb,
        hitCount: 6,
        withReact: false
      },
      // Q
      {
        baseDmg: Qa,
        hitCount: 1,
        withReact: true
      },
      {
        baseDmg: Qa,
        hitCount: 3,
        withReact: false
      },
      // CA
      {
        baseDmg: CA,
        hitCount: 3,
        withReact: true
      },
      // NA
      {
        baseDmg: NA,
        hitCount: 6,
        withReact: true
      },
      {
        baseDmg: NA,
        hitCount: 12,
        withReact: false
      }
    ];
  }

}

