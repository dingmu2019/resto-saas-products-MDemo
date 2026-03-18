import { ProductRule } from '../../types';

export const mockRules: ProductRule[] = [
  { id: 1, sourceSkuId: 1071, targetSkuId: 1013, ruleType: 'requires', message: 'KDS Screens require the RestoSuite Pro subscription to function.' },
  { id: 2, sourceSkuId: 1021, targetSkuId: 1022, ruleType: 'excludes', message: 'Cannot mix Classic Black and Classic White terminals in the same starter bundle.' },
  { id: 3, sourceSkuId: 1013, targetSkuId: 1051, ruleType: 'recommends', message: 'Pro users typically benefit greatly from the Advanced Analytics add-on.' },
  { id: 4, sourceSkuId: 1032, targetSkuId: 1011, ruleType: 'compatible_with', message: 'WiFi Printers are fully compatible with the Basic subscription.' },
];
