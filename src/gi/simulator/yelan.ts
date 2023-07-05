import * as genshindb from 'genshin-db';
import { Condition, IcdType, Simulator } from '@gi/core/simulator';
import { AdditiveType, AmplifyingType, TransformativeType } from '@gi/core/calculator';
import { WeaponType } from '@gi/core/weapon';

export class Yelan extends Simulator {

  constructor(condition: Condition) {
    super(condition);
  }

  get baseDmg(): number {
    let talents = genshindb.talents(this.character.charType);
    var talentParams = talents?.combat3.attributes.parameters;
    return this.atk * (talentParams != undefined ? talentParams["param4"][12] : 2.380000114440918);
  }

  override get atk(): number {
    let bonusAtk = 0;
    if (this.character.weaponType == WeaponType.StaffOfTheScarletSands) {
      bonusAtk = this.em * 0.52;
    }
    return super.atk + bonusAtk;
  }

  override get transformativeType(): TransformativeType {
    return TransformativeType.None;
  }
  override get amplifyingType(): AmplifyingType {
    return AmplifyingType.VaporizeReverse;
  }
  override get additiveType(): AdditiveType {
    return AdditiveType.None;
  }
  override get dmgBonus(): number {
    let dmgBonus = this.er * 0.25;
    if (this.character.weaponType == WeaponType.TheCatch) {
      dmgBonus += 0.32;
    }
    return super.dmgBonus + dmgBonus;
  }
  override get rate(): number {
    let rateBonus = 0;
    if (this.character.weaponType == WeaponType.TheCatch) {
      rateBonus += 0.12;
    }
    return super.rate + rateBonus;
  }
  override get icdType(): IcdType {
    return IcdType.None;
  }

}

