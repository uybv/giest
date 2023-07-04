import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { CircletValueType, FlowerValueType, GobletValueType, PlumeValueType, SandValueType, SubValueType } from '@gi/core/artifact';
import { CharacterType } from '@gi/core/character';
import { VALUES, ValueType } from '@gi/core/common';
import { Damage, DamageResult } from '@gi/core/damage';
import { Condition, ConditionValue, DmgType, OprType, ResultType } from '@gi/core/simulator';
import { WeaponType } from '@gi/core/weapon';
import { Estimate } from '@gi/estimate';

const CONFIG_VIEW = 'configView';
const CONFIG_DATA = 'configData';

const DEFAULT_ARTIFACTS: ConfigArtifacts = {
  flowerTypes: [
    { key: ValueType.HpFlat, value: true }
  ],
  plumeTypes: [
    { key: ValueType.AtkFlat, value: true}
  ],
  sandTypes: [
    { key: ValueType.AtkPercent, value: true },
    { key: ValueType.DefPercent, value: false },
    { key: ValueType.EmFlat, value: false },
    { key: ValueType.Er, value: false },
    { key: ValueType.HpPercent, value: false }
  ],
  gobletTypes: [
    { key: ValueType.AtkPercent, value: false },
    { key: ValueType.DefPercent, value: false },
    { key: ValueType.HpPercent, value: false },
    { key: ValueType.EmFlat, value: false },
    { key: ValueType.DmgBonus, value: true },
    { key: ValueType.PDmgBonus, value: false }
  ],
  circletTypes: [
    { key: ValueType.AtkPercent, value: false },
    { key: ValueType.CritDmg, value: true },
    { key: ValueType.CritRate, value: true },
    { key: ValueType.DefPercent, value: false },
    { key: ValueType.EmFlat, value: false },
    { key: ValueType.HealBonus, value: false },
    { key: ValueType.HpPercent, value: false }
  ],
  subStatTypes: [
    { key: ValueType.AtkFlat, value: false },
    { key: ValueType.AtkPercent, value: true },
    { key: ValueType.CritDmg, value: true },
    { key: ValueType.CritRate, value: true },
    { key: ValueType.DefFlat, value: false },
    { key: ValueType.DefPercent, value: false },
    { key: ValueType.DmgBonus, value: false },
    { key: ValueType.EmFlat, value: false },
    { key: ValueType.Er, value: true },
    { key: ValueType.HpFlat, value: false },
    { key: ValueType.HpPercent, value: false }
  ],
  subUpCount: 30
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'giest';

  isLoading: boolean = false;
  private worker: Worker | undefined;

  master: {
    characterTypes: CharacterType[],
    weaponTypes: WeaponType[],
    valueTypes: ValueType[],
    dmgTypes: DmgType[],
    resultTypes: ResultType[],
    oprTypes: OprType[],
    oprValues: ValueType[]
  } = {
    characterTypes: Object.values(CharacterType),
    weaponTypes: Object.values(WeaponType),
    valueTypes: Object.values(ValueType),
    dmgTypes: Object.values(DmgType),
    resultTypes: Object.values(ResultType),
    oprTypes: Object.values(OprType),
    oprValues: [ValueType.Er, ValueType.CritRate, ValueType.CritDmg]
  };

  characterType: CharacterType = CharacterType.KamisatoAyaka;
  weaponType: WeaponType = WeaponType.MistsplitterReforged;
  dmgType: DmgType = DmgType.Avg;
  resultType: ResultType = ResultType.All;
  resultCount: number = 10;
  conditionValues: ConditionValue[] = [];

  artifacts: ConfigArtifacts = Object.assign({}, DEFAULT_ARTIFACTS);

  buffs: Buff[] = [];

  configViews: ConfigViews = {
    columns: [
      { key: ConfigType.columnAtk, value: true },
      { key: ConfigType.columnDef, value: false },
      { key: ConfigType.columnHp, value: false },
      { key: ConfigType.columnEm, value: false },
      { key: ConfigType.columnEr, value: true },
      { key: ConfigType.columnRate, value: true },
      { key: ConfigType.columnCrit, value: true },
      { key: ConfigType.columnDmgBonus, value: true },
      { key: ConfigType.columnFlatDmg, value: false },
      { key: ConfigType.groupArtifacts, value: true },
      //{ key: ConfigType.groupBalance, value: false }
    ],
    showDefault: true
  };

  private readonly est: Estimate = new Estimate();
  results: Damage[] = [];

  public constructor() {
    if (localStorage) {
      var configViewStr = localStorage.getItem(CONFIG_VIEW);
      if (configViewStr) {
        try {
          let configViews: ConfigViews = JSON.parse(configViewStr);
          if (configViews) {
            this.configViews.columns.forEach(c => {
              c.value = configViews.columns.find(x => x.key == c.key)?.value ?? c.value;
            });
            this.configViews.showDefault = configViews?.showDefault ?? true;
          }
        } catch {
          // Nothing
        }
      }
      this.changeCharacter();
    }
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./estimate.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        this.isLoading = false;
        let condition = this.condition;
        console.log(condition);
        console.log(data);
        if (data) {
          let dmgResults: DamageResult[] = data;
          this.results = dmgResults.map(r => {
            let sim = this.est.getSimulator(condition);
            sim.character.artifact.sand = r.sand;
            sim.character.artifact.goblet = r.goblet;
            sim.character.artifact.circlet = r.circlet;
            sim.character.artifact.subUps = r.subUps;
            return new Damage(sim);
          });
          //this.results[0].simulator.dmgBonus
          console.log(this.results[0]);
        }
      };
    }
  }

  private get configData(): ConfigData {
    return {
      character: this.characterType,
      weapon: this.weaponType,
      artifacts: this.artifacts,
      buffs: this.buffs,
      dmgType: this.dmgType,
      resultType: this.resultType,
      resultCount: this.resultCount,
      conditions: this.conditionValues
    };
  }

  private get configDatas(): ConfigData[] {
    let configs: ConfigData[] = [];
    let configDataStr = localStorage.getItem(CONFIG_DATA);
    if (configDataStr) {
      try {
        configs = JSON.parse(configDataStr);
      } finally {
        // Nothing
      }
    }
    return configs;
  }

  public get condition(): Condition {
    return {
      character: this.characterType,
      characterLvl: 90,
      weapon: this.weaponType,
      weaponLvl: 90,
      artifacts: {
        flowerTypes: this.artifacts.flowerTypes.filter(x => x.value).map(x => x.key as FlowerValueType),
        plumeTypes: this.artifacts.plumeTypes.filter(x => x.value).map(x => x.key as PlumeValueType),
        sandTypes: this.artifacts.sandTypes.filter(x => x.value).map(x => x.key as SandValueType),
        gobletTypes: this.artifacts.gobletTypes.filter(x => x.value).map(x => x.key as GobletValueType),
        circletTypes: this.artifacts.circletTypes.filter(x => x.value).map(x => x.key as CircletValueType),
        subUpCount: this.artifacts.subUpCount
      },
      buffs: this.buffs.map(b => { return { type: b.type, value: b.value, base: b.isEffect }; }),
      search: {
        dmgType: this.dmgType,
        resultType: this.resultType,
        subStatTypes: this.artifacts.subStatTypes.filter(x => x.value).map(x => x.key as SubValueType),
        conditions: this.conditionValues
      },
      results: {
        count: this.resultCount
      }
    };
  }

  public calculate(): void {
    this.updateConfigs();
    if (this.worker != undefined) {
      this.isLoading = true;
      this.worker.postMessage(this.condition);
    } else {

    }
  }

  public changeCharacter(): void {
    let configs = this.configDatas;
    let config = this.configData;
    let current = configs.find(c => c.character == config.character);
    if (current) {
      this.weaponType = current.weapon ?? WeaponType.MistsplitterReforged;
      this.artifacts = current.artifacts ?? Object.assign({}, DEFAULT_ARTIFACTS);
      this.buffs = current.buffs ?? [];
      this.dmgType = current.dmgType ?? DmgType.Avg;
      this.resultType = current.resultType ?? ResultType.All;
      this.resultCount = current.resultCount ?? 10;
      this.conditionValues = current.conditions ?? [];
    }
  }

  public updateConfigs(): void {
    if (localStorage) {
      let configs = this.configDatas;
      let config = this.configData;
      if (configs.some(c => c.character == config.character)) {
        for (const idx in configs) {
          if (configs[idx].character == config.character) {
            configs[idx] = config;
            break;
          }
        }
      } else {
        configs.push(config);
      }
      localStorage.setItem(CONFIG_DATA, JSON.stringify(configs));
    }
  }

  public updateConfigViews(): void {
    if (localStorage) {
      console.log(this.configViews);
      localStorage.setItem(CONFIG_VIEW, JSON.stringify(this.configViews));
    }
  }

  public formatValueTypeList(valueTypes: KeyValue<ValueType, boolean>[]): string {
    return valueTypes.filter(x => x.value).map(x => VALUES[x.key]).join(' | ');
  }

  public columnIsHide(column: string): boolean {
    return !this.configViews.columns.some(c => c.key == column && c.value);
  }

  public removeBuff(idx: number): void {
    this.buffs.splice(idx, 1);
  }

  public addBuff(): void {
    this.buffs.push({
      name: '',
      type: ValueType.AtkPercent,
      value: 0,
      isEffect: false
    });
  }


  public dataStr: string = '';

  public loadSnap() {
    try {
      var current: ConfigData = JSON.parse(this.dataStr);
      this.weaponType = current.weapon ?? WeaponType.MistsplitterReforged;
      this.artifacts = current.artifacts ?? Object.assign({}, DEFAULT_ARTIFACTS);
      this.buffs = current.buffs ?? [];
      this.dmgType = current.dmgType ?? DmgType.Avg;
      this.resultType = current.resultType ?? ResultType.All;
      this.resultCount = current.resultCount ?? 10;
      this.conditionValues = current.conditions ?? [];
    } catch (e) {
      alert(e);
    }
  }

  public openSnap() {
    this.dataStr = JSON.stringify(this.configData);
  }

  public removeCondition(idx: number) {
    this.conditionValues.splice(idx, 1);
  }

  public addCondition() {
    this.conditionValues.push({
      opr: OprType.GT,
      type: ValueType.Er,
      value: 1
    });
  }
}

interface ConfigArtifacts {
  flowerTypes: KeyValue<FlowerValueType, boolean>[];
  plumeTypes: KeyValue<PlumeValueType, boolean>[];
  sandTypes: KeyValue<SandValueType, boolean>[];
  gobletTypes: KeyValue<GobletValueType, boolean>[];
  circletTypes: KeyValue<CircletValueType, boolean>[];
  subStatTypes: KeyValue<SubValueType, boolean>[];
  subUpCount: number;
}

interface Buff {
  name: string;
  type: ValueType;
  value: number;
  isEffect: boolean;
}

interface ConfigData {
  character: CharacterType;
  weapon: WeaponType;
  artifacts: ConfigArtifacts;
  buffs: Buff[];
  dmgType: DmgType;
  resultType: ResultType;
  resultCount: number;
  conditions: ConditionValue[]
}

enum ConfigType {
  columnAtk = 'ATK',
  columnDef = 'DEF',
  columnHp = 'HP',
  columnEm = 'EM',
  columnEr = 'ER',
  columnCrit = 'CRIT',
  columnRate = 'RATE',
  columnDmgBonus = 'DMG BONUS',
  columnFlatDmg = 'FLAT DMG',
  groupArtifacts = 'ARTIFACTS',
  groupBalance = 'BALANCE'
};

interface ConfigViews {
  columns: KeyValue<ConfigType, boolean>[],
  showDefault: boolean
};


