export enum AdditiveType {
  None = 'None',
  Spread = 'Spread',
  Aggravate = 'Aggravate'
};

export const ADDITIVE: {
  [key: string]: number
} = {
  [AdditiveType.None]: 0,
  [AdditiveType.Spread]: 1.25,
  [AdditiveType.Aggravate]: 1.15,
};

export enum TransformativeType {
  None = 'None',
  Burgeon = 'Burgeon',
  Hyperbloom = 'Hyperbloom',
  Overloaded = 'Overloaded',
  Bloom = 'Bloom',
  Shattered = 'Shattered',
  ElectroCharged = 'ElectroCharged',
  Swirl = 'Swirl',
  Superconduct = 'Superconduct',
  Burning = 'Burning',
};

export const TRANSFORMATIVE: {
  [key: string]: number
} = {
  [TransformativeType.None]: 0,
  [TransformativeType.Burgeon]: 3.0,
  [TransformativeType.Hyperbloom]: 3.0,
  [TransformativeType.Overloaded]: 2.0,
  [TransformativeType.Bloom]: 2.0,
  [TransformativeType.Shattered]: 1.5,
  [TransformativeType.ElectroCharged]: 1.2,
  [TransformativeType.Swirl]: 0.6,
  [TransformativeType.Superconduct]: 0.5,
  [TransformativeType.Burning]: 0.25,
};

export enum AmplifyingType {
  None = 'None',
  Vaporize = 'Vaporize', // Hydro => Pyro
  Melt = 'Melt', // Pyro => Cryo
  VaporizeReverse = 'VaporizeReverse', // Pyro => Hydro
  MeltReverse = 'MeltReverse', // Cryo => Pyro
};

export const AMPLIFYING: {
  [key: string]: number
} = {
  [AmplifyingType.None]: 0,
  [AmplifyingType.Vaporize]: 2.0,
  [AmplifyingType.Melt]: 2.0,
  [AmplifyingType.VaporizeReverse]: 1.5,
  [AmplifyingType.MeltReverse]: 1.5,
};

export const LEVEL_MULTIPLIER: {
  [key: number]: number
} = {
  1: 17.165605,
  2: 18.535048,
  3: 19.904854,
  4: 21.274903,
  5: 22.645400,
  6: 24.649613,
  7: 26.640643,
  8: 28.868587,
  9: 31.367679,
  10: 34.143343,
  11: 37.201000,
  12: 40.660000,
  13: 44.446668,
  14: 48.563519,
  15: 53.748480,
  16: 59.081897,
  17: 64.420047,
  18: 69.724455,
  19: 75.123137,
  20: 80.584775,
  21: 86.112028,
  22: 91.703742,
  23: 97.244628,
  24: 102.812644,
  25: 108.409563,
  26: 113.201694,
  27: 118.102906,
  28: 122.979318,
  29: 129.727330,
  30: 136.292910,
  31: 142.670850,
  32: 149.029029,
  33: 155.416987,
  34: 161.825495,
  35: 169.106313,
  36: 176.518077,
  37: 184.072741,
  38: 191.709518,
  39: 199.556908,
  40: 207.382042,
  41: 215.398900,
  42: 224.165667,
  43: 233.502160,
  44: 243.350573,
  45: 256.063067,
  46: 268.543493,
  47: 281.526075,
  48: 295.013648,
  49: 309.067188,
  50: 323.601597,
  51: 336.757542,
  52: 350.530312,
  53: 364.482705,
  54: 378.619181,
  55: 398.600417,
  56: 416.398254,
  57: 434.386996,
  58: 452.951051,
  59: 472.606217,
  60: 492.884890,
  61: 513.568543,
  62: 539.103198,
  63: 565.510563,
  64: 592.538753,
  65: 624.443427,
  66: 651.470148,
  67: 679.496830,
  68: 707.794060,
  69: 736.671422,
  70: 765.640231,
  71: 794.773403,
  72: 824.677397,
  73: 851.157781,
  74: 877.742090,
  75: 914.229123,
  76: 946.746752,
  77: 979.411386,
  78: 1011.223022,
  79: 1044.791746,
  80: 1077.443668,
  81: 1109.997540,
  82: 1142.976615,
  83: 1176.369483,
  84: 1210.184393,
  85: 1253.835659,
  86: 1288.952801,
  87: 1325.484092,
  88: 1363.456928,
  89: 1405.097377,
  90: 1446.853458,
  91: 1488.215547,
  92: 1528.444567,
  93: 1580.367911,
  94: 1630.847528,
  95: 1711.197785,
  96: 1780.453941,
  97: 1847.322809,
  98: 1911.474309,
  99: 1972.864342,
  100: 2030.071808,
};
