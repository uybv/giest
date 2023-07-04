import * as genshindb from 'genshin-db';
import { Condition, Simulator } from '@gi/core/simulator';
import { AdditiveType, AmplifyingType, TransformativeType } from '@gi/core/calculator';

export class Miko extends Simulator {

  constructor(condition: Condition) {
    super(condition);
  }

  get baseDmg(): number {
    let talents = genshindb.talents(this.character.charType);
    var talentParams = talents?.combat2.attributes.parameters;
    var per: number = (talentParams != undefined ? talentParams["param3"][9] : 1.71);
    return this.atk * per;
  }

  override get transformativeType(): TransformativeType {
    return TransformativeType.None;
  }
  override get amplifyingType(): AmplifyingType {
    return AmplifyingType.None;
  }
  override get additiveType(): AdditiveType {
    return AdditiveType.Aggravate;
  }

  override get dmgBonus(): number {
    // A2
    let dmgBonus = this.em * 0.15 / 100;
    return super.dmgBonus + dmgBonus;
  }

}

