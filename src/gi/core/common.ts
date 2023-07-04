export enum ValueType {
  AtkFlat = 'AtkFlat',
  AtkPercent = 'AtkPercent',
  DefFlat = 'DefFlat',
  DefPercent = 'DefPercent',
  HpFlat = 'HpFlat',
  HpPercent = 'HpPercent',
  EmFlat = 'EmFlat',
  EmPercent = 'EmPercent',
  Er = 'Er',
  CritRate = 'CritRate',
  CritDmg = 'CritDmg',
  DmgBonus = 'DmgBonus',
  PDmgBonus = 'PDmgBonus',
  HealBonus = 'HealBonus',
  FlatDmg = 'FlatDmg',
  ResistanceReduction = 'ResistanceReduction',
  DefReduction = 'DefReduction',
  DefIgnore = 'DefIgnore'
};

export const VALUES: {
  [key: string]: string
} = {
  [ValueType.AtkFlat]: 'Atk',
  [ValueType.AtkPercent]: '%Atk',
  [ValueType.DefFlat]: 'Def',
  [ValueType.DefPercent]: '%Def',
  [ValueType.HpFlat]: 'Hp',
  [ValueType.HpPercent]: '%Hp',
  [ValueType.EmFlat]: 'Em',
  [ValueType.EmPercent]: '%Em',
  [ValueType.Er]: '%Er',
  [ValueType.CritRate]: '%Rate',
  [ValueType.CritDmg]: '%Crit',
  [ValueType.HealBonus]: '%Heal',
  [ValueType.DmgBonus]: '%DmgBonus',
  [ValueType.PDmgBonus]: '%PhysicalDmgBonus',
  [ValueType.FlatDmg]: 'FlatDmg',
  [ValueType.ResistanceReduction]: '%ResistanceReduction',
  [ValueType.DefReduction]: '%DefReduction',
  [ValueType.DefIgnore]: '%DefIgnore'
};

export enum SPECIALIZED {
  AtkPercent = 'atk',
  DefPercent = 'def',
  HpPercent = 'hp',
  DmgBonus = 'dmg bonus',
  CritDmg = 'crit dmg',
  CritRate = 'crit rate',
  EmFlat = 'elemental mastery',
  Er = 'energy recharge'
};
