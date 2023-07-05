import * as genshindb from 'genshin-db';
import { Artifact } from './artifact';
import { SPECIALIZED, ValueType } from './common';
import { WeaponType } from './weapon';

export const BASE_CRIT: number = 0.5;
export const BASE_RATE: number = 0.05;
export const BASE_EM: number = 0;
export const BASE_ER: number = 1;
export const BASE_DMG_BONUS: number = 0;

export enum CharacterType {
  KamisatoAyaka = 'KamisatoAyaka',
  Xiao = 'Xiao',
  YaeMiko = 'YaeMiko',
  Nahida = 'Nahida',
  Alhaitham = 'Alhaitham',
  Xiangling = 'Xiangling'
};

export interface ICharacter {
  get base(): Record<ValueType, number>;
  get hp(): number;
  get atk(): number;
  get def(): number;
  get crit(): number;
  get rate(): number;
  get dmgBonus(): number;
  get er(): number;
  get em(): number;
}

export class Character implements ICharacter {

  private readonly _base: Record<ValueType, number> = {
    [ValueType.AtkFlat]: 0,
    [ValueType.AtkPercent]: 0,
    [ValueType.DefFlat]: 0,
    [ValueType.DefPercent]: 0,
    [ValueType.HpFlat]: 0,
    [ValueType.HpPercent]: 0,
    [ValueType.EmFlat]: 0,
    [ValueType.EmPercent]: 0,
    [ValueType.Er]: 0,
    [ValueType.CritRate]: 0,
    [ValueType.CritDmg]: 0,
    [ValueType.DmgBonus]: 0,
    [ValueType.PDmgBonus]: 0,
    [ValueType.HealBonus]: 0,
    [ValueType.FlatDmg]: 0,
    [ValueType.ResistanceReduction]: 0,
    [ValueType.DefReduction]: 0,
    [ValueType.DefIgnore]: 0
  };

  public readonly effect: Record<ValueType, number> = {
    [ValueType.AtkFlat]: 0,
    [ValueType.AtkPercent]: 0,
    [ValueType.DefFlat]: 0,
    [ValueType.DefPercent]: 0,
    [ValueType.HpFlat]: 0,
    [ValueType.HpPercent]: 0,
    [ValueType.EmFlat]: 0,
    [ValueType.EmPercent]: 0,
    [ValueType.Er]: 0,
    [ValueType.CritRate]: 0,
    [ValueType.CritDmg]: 0,
    [ValueType.DmgBonus]: 0,
    [ValueType.PDmgBonus]: 0,
    [ValueType.HealBonus]: 0,
    [ValueType.FlatDmg]: 0,
    [ValueType.ResistanceReduction]: 0,
    [ValueType.DefReduction]: 0,
    [ValueType.DefIgnore]: 0
  };

  constructor(public charType: CharacterType,
              public weaponType: WeaponType,
              public charLevel: number = 90,
              public weaponLevel: number = 90,
              public artifact: Artifact = new Artifact()) {
    var dbChar = genshindb.characters(charType);
    var charStats = dbChar?.stats(charLevel);
    this._base.AtkFlat = charStats?.attack ?? 0;
    this._base.HpFlat = charStats?.hp ?? 0;
    this._base.DefFlat = charStats?.defense ?? 0;
    this._base.AtkPercent = dbChar?.substat.toLowerCase().includes(SPECIALIZED.AtkPercent) ? (charStats?.specialized ?? 0) : 0;
    this._base.DefPercent = dbChar?.substat.toLowerCase().includes(SPECIALIZED.DefPercent) ? (charStats?.specialized ?? 0) : 0;
    this._base.HpPercent = dbChar?.substat.toLowerCase().includes(SPECIALIZED.HpPercent) ? (charStats?.specialized ?? 0) : 0;
    this._base.DmgBonus = dbChar?.substat.toLowerCase().includes(SPECIALIZED.DmgBonus) ? (charStats?.specialized ?? 0) : BASE_DMG_BONUS;
    this._base.CritDmg = dbChar?.substat.toLowerCase().includes(SPECIALIZED.CritDmg) ? (charStats?.specialized ?? 0) : BASE_CRIT;
    this._base.CritRate = dbChar?.substat.toLowerCase().includes(SPECIALIZED.CritRate) ? (charStats?.specialized ?? 0) : BASE_RATE;
    this._base.EmFlat = dbChar?.substat.toLowerCase().includes(SPECIALIZED.EmFlat) ? (charStats?.specialized ?? 0) : BASE_EM;
    this._base.Er = BASE_ER + (dbChar?.substat.toLowerCase().includes(SPECIALIZED.Er) ? (charStats?.specialized ?? 0) : 0);

    //var talents = genshindb.talents(charType);

    var dbWeapon = genshindb.weapons(weaponType);
    var weaponStats = dbWeapon?.stats(weaponLevel);
    this._base.AtkFlat += (weaponStats?.attack ?? 0);
    this._base.HpFlat += (weaponStats?.hp ?? 0);
    this._base.DefFlat += (weaponStats?.defense ?? 0);
    this._base.AtkPercent += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.AtkPercent) ? (weaponStats?.specialized ?? 0) : 0;
    this._base.DefPercent += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.DefPercent) ? (weaponStats?.specialized ?? 0) : 0;
    this._base.HpPercent += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.HpPercent) ? (weaponStats?.specialized ?? 0) : 0;
    this._base.DmgBonus += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.DmgBonus) ? (weaponStats?.specialized ?? 0) : 0;
    this._base.CritDmg += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.CritDmg) ? (weaponStats?.specialized ?? 0) : 0;
    this._base.CritRate += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.CritRate) ? (weaponStats?.specialized ?? 0) : 0;
    this._base.EmFlat += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.EmFlat) ? (weaponStats?.specialized ?? 0) : 0;
    this._base.Er += dbWeapon?.substat.toLowerCase().includes(SPECIALIZED.Er) ? (weaponStats?.specialized ?? 0) : 0;
  }

  get isValid(): boolean {
    return this.artifact.isValid;
  }

  get base(): Record<ValueType, number> {
    return this._base;
  }
  get hp(): number {
    return this.base.HpFlat * (1 + this.base.HpPercent + this.effect.HpPercent + this.artifact.getValue(ValueType.HpPercent))
      + this.effect.HpFlat
      + this.artifact.getValue(ValueType.HpFlat);
  }
  get atk(): number {
    return this.base.AtkFlat * (1 + this.base.AtkPercent + this.effect.AtkPercent + this.artifact.getValue(ValueType.AtkPercent))
      + this.effect.AtkFlat
      + this.artifact.getValue(ValueType.AtkFlat);
  }
  get def(): number {
    return this.base.DefFlat * (1 + this.base.DefPercent + this.effect.DefPercent + this.artifact.getValue(ValueType.DefPercent))
      + this.effect.DefFlat
      + this.artifact.getValue(ValueType.DefFlat);
  }
  get crit(): number {
    return this.base.CritDmg + this.effect.CritDmg + this.artifact.getValue(ValueType.CritDmg);
  }
  get rate(): number {
    var rate = this.base.CritRate + this.effect.CritRate + this.artifact.getValue(ValueType.CritRate);
    return rate > 1 ? 1 : rate;
  }
  get dmgBonus(): number {
    return this.base.DmgBonus + this.effect.DmgBonus + this.artifact.getValue(ValueType.DmgBonus);
  }
  get er(): number {
    return this.base.Er + this.effect.Er + this.artifact.getValue(ValueType.Er);
  }
  get em(): number {
    return (this.base.EmFlat + this.effect.EmFlat + this.artifact.getValue(ValueType.EmFlat)) * (1 + this.base.EmPercent + this.effect.EmPercent + this.artifact.getValue(ValueType.EmPercent));
  }

}
