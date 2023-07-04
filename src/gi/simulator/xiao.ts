import * as genshindb from 'genshin-db';
import { Condition, Simulator } from '@gi/core/simulator';

export class Xiao extends Simulator {

  constructor(condition: Condition) {
    super(condition);
  }

  get baseDmg(): number {
    let talents = genshindb.talents(this.character.charType);
    var talentParams = talents?.combat1.attributes.parameters;
    var per: number = (talentParams != undefined ? talentParams["param13"][9] : 4.04);
    return this.atk * per;
  }
}

