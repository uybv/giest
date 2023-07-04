import * as genshindb from 'genshin-db';
import { Condition, Simulator } from '@gi/core/simulator';

export class Ayaka extends Simulator {

  constructor(condition: Condition) {
    super(condition);
  }

  get baseDmg(): number {
    let talents = genshindb.talents(this.character.charType);
    var talentParams = talents?.combat3.attributes.parameters;
    var per: number = (talentParams != undefined ? talentParams["param1"][9] : 2.02);
    return this.atk * per;
  }
}

