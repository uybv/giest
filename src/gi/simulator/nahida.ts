import * as genshindb from 'genshin-db';
import { Condition, Simulator } from '@gi/core/simulator';
import { AdditiveType } from '@gi/core/calculator';

export class Nahida extends Simulator {

  constructor(condition: Condition) {
    super(condition);
  }

  get baseDmg(): number {
    return this.atk * 1.858 + this.em * 3.715;
  }

  override get em(): number {
    let addEm = super.em * 0.25;
    if (addEm > 250) {
      addEm = 250;
    }
    return super.em + addEm;
  }

  override get dmgBonus(): number {
    let emAdd = this.em - 200;
    if (emAdd < 0) {
      emAdd = 0;
    }
    let dmgBonusAdd = emAdd * 0.1 / 100;
    if (dmgBonusAdd > 0.8) {
      dmgBonusAdd = 0.8;
    }
    return super.dmgBonus + dmgBonusAdd;
  }

  override get rate(): number {
    let emAdd = this.em - 200;
    if (emAdd < 0) {
      emAdd = 0;
    }
    let rateAdd = emAdd * 0.03 / 100;
    if (rateAdd > 0.24) {
      rateAdd = 0.24;
    }
    return super.rate + rateAdd;
  }

  override get additiveType(): AdditiveType {
    return AdditiveType.Spread;
  }

}

