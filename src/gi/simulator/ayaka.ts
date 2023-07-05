import * as genshindb from 'genshin-db';
import { Combo, Condition, Simulator } from '@gi/core/simulator';

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

  override get combo(): Combo[] {
    let talents = genshindb.talents(this.character.charType);
    var skillA = talents?.combat1.attributes.parameters;
    var skillE = talents?.combat2.attributes.parameters;
    var skillQ = talents?.combat2.attributes.parameters;

    return [
      {
        baseDmg: this.atk * skillQ!["param1"][9],
        hitCount: 20,
        withReact: false
      }
    ];
  }
}

