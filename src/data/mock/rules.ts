import { ProductRule } from '../../types';

export const mockRules: ProductRule[] = [
  { id: 1, sourceSkuId: 1071, targetSkuId: 1013, ruleType: 'requires', message: 'KDS 厨房屏幕需要搭配 RestoSuite 专业版订阅才能正常工作。' },
  { id: 2, sourceSkuId: 1021, targetSkuId: 1022, ruleType: 'excludes', message: '同一个入门套装中不能混搭黑色和白色经典收银机。' },
  { id: 3, sourceSkuId: 1013, targetSkuId: 1051, ruleType: 'recommends', message: '强烈建议专业版用户选购高级数据分析插件，以获得更深度的业务洞察。' },
  { id: 4, sourceSkuId: 1032, targetSkuId: 1011, ruleType: 'compatible_with', message: 'WiFi 打印机完全兼容基础版订阅。' },
];
