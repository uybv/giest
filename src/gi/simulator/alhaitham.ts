import * as genshindb from 'genshin-db';
import { Condition, Simulator } from '@gi/core/simulator';
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

  override get dmgBonus(): number {
    let dmgBonus = this.em * 0.1 / 100;
    return super.dmgBonus + dmgBonus;
  }

  override get flatDmg(): number {
    let flatDmg = 0;
    if (this.character.weaponType == WeaponType.LightOfFoliarIncision) {
      flatDmg = this.em * 1.2;
    }
    return super.flatDmg + flatDmg;
  }

}

