import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../components/ui';
import { 
  mockBundleGroups, mockBundleOptions, mockSkus, mockPriceBookEntries, 
  mockPriceBooks, mockTaxRegions, mockTaxRates, mockRules, mockEntitlements, mockFeatures, mockProducts
} from '../data/mock';
import { Tags, CheckCircle2, Circle, ShoppingCart, Info, Package, AlertTriangle, ShieldCheck } from 'lucide-react';

export function CPQDemo() {
  const { t } = useTranslation();
  
  // Settings
  const [selectedBundleId, setSelectedBundleId] = useState<number>(1041);
  const [selectedPriceBookId, setSelectedPriceBookId] = useState<number>(1);
  const [selectedTaxRegionId, setSelectedTaxRegionId] = useState<number>(2); // Default to CA

  const bundleSkus = mockSkus.filter(s => s.uom === 'Bundle');
  const activeGroups = mockBundleGroups.filter(g => g.bundleSkuId === selectedBundleId);
  const activeOptions = mockBundleOptions.filter(o => o.bundleSkuId === selectedBundleId);
  const priceBook = mockPriceBooks.find(pb => pb.id === selectedPriceBookId);

  // Selections state: Record<groupId, Record<skuId, quantity>>
  const [selections, setSelections] = useState<Record<number, Record<number, number>>>({});

  // Initialize default selections
  useEffect(() => {
    const initialSelections: Record<number, Record<number, number>> = {};
    activeGroups.forEach(group => {
      initialSelections[group.id] = {};
      activeOptions
        .filter(opt => opt.groupId === group.id && opt.isDefault)
        .forEach(opt => {
          initialSelections[group.id][opt.componentSkuId] = 1;
        });
    });
    setSelections(initialSelections);
  }, [selectedBundleId]);

  const handleSelect = (groupId: number, skuId: number, isMutuallyExclusive: boolean) => {
    setSelections(prev => {
      const currentGroupSelections = { ...prev[groupId] };
      
      if (isMutuallyExclusive) {
        return { ...prev, [groupId]: { [skuId]: 1 } };
      } else {
        if (currentGroupSelections[skuId]) {
          delete currentGroupSelections[skuId];
        } else {
          currentGroupSelections[skuId] = 1;
        }
        return { ...prev, [groupId]: currentGroupSelections };
      }
    });
  };

  const handleQuantityChange = (groupId: number, skuId: number, delta: number) => {
    setSelections(prev => {
      const currentGroupSelections = { ...prev[groupId] };
      const currentQty = currentGroupSelections[skuId] || 0;
      const newQty = Math.max(1, currentQty + delta);
      currentGroupSelections[skuId] = newQty;
      return { ...prev, [groupId]: currentGroupSelections };
    });
  };

  // 1. Product Rules Enforcement
  const allSelectedSkuIds = Object.values(selections).flatMap(group => Object.keys(group).map(Number));
  
  const ruleMessages: { skuId: number, type: string, message: string }[] = [];
  const recommendedSkuIds = new Set<number>();
  const disabledSkuIds = new Set<number>();

  mockRules.forEach(rule => {
    const sourceSelected = allSelectedSkuIds.includes(rule.sourceSkuId);
    const targetSelected = allSelectedSkuIds.includes(rule.targetSkuId);

    if (sourceSelected) {
      if (rule.ruleType === 'requires' && !targetSelected) {
        ruleMessages.push({ skuId: rule.sourceSkuId, type: 'error', message: rule.message || `Requires SKU ${rule.targetSkuId}` });
      }
      if (rule.ruleType === 'excludes' && targetSelected) {
        ruleMessages.push({ skuId: rule.sourceSkuId, type: 'error', message: rule.message || `Incompatible with SKU ${rule.targetSkuId}` });
        disabledSkuIds.add(rule.targetSkuId); // Disable the target
      }
      if (rule.ruleType === 'recommends' && !targetSelected) {
        recommendedSkuIds.add(rule.targetSkuId);
      }
    }
  });

  // 2 & 5. Pricing Calculation (Dynamic Price Book & Tiered Pricing)
  const getSkuDetails = (skuId: number) => mockSkus.find(s => s.id === skuId);
  const getProductDetails = (productId: number) => mockProducts.find(p => p.id === productId);

  const getOptionPricing = (skuId: number, groupId: number, qty: number = 1) => {
    const option = activeOptions.find(o => o.componentSkuId === skuId && o.groupId === groupId);
    if (!option) return null;
    
    const basePriceEntry = mockPriceBookEntries.find(e => e.skuId === skuId && e.priceBookId === selectedPriceBookId);
    
    let basePrice = basePriceEntry?.listPrice || 0;
    
    // Tiered pricing logic
    if (basePriceEntry?.pricingStrategy === 'tiered' && basePriceEntry.tierConfig) {
      const tier = basePriceEntry.tierConfig.find((t: any) => qty >= t.minQty && qty <= t.maxQty);
      if (tier) basePrice = tier.price;
    }

    let unitPrice = 0;
    let label = '';

    switch (option.pricingType) {
      case 'included':
        unitPrice = 0;
        label = 'Included';
        break;
      case 'fixed_override':
        unitPrice = option.pricingValue || 0;
        label = `${priceBook?.currency === 'EUR' ? '€' : '$'}${unitPrice.toFixed(2)} (Override)`;
        break;
      case 'price_adjustment':
        unitPrice = basePrice + (option.pricingValue || 0);
        label = `${option.pricingValue && option.pricingValue > 0 ? '+' : ''}${priceBook?.currency === 'EUR' ? '€' : '$'}${unitPrice.toFixed(2)}`;
        break;
    }

    return { unitPrice, finalPrice: unitPrice * qty, label, type: option.pricingType };
  };

  // 3. Automated Tax Calculation
  const bundleBasePriceEntry = mockPriceBookEntries.find(e => e.skuId === selectedBundleId && e.priceBookId === selectedPriceBookId);
  let subtotal = bundleBasePriceEntry?.listPrice || 0;
  let totalTax = 0;

  const calculateTax = (skuId: number, price: number) => {
    const sku = getSkuDetails(skuId);
    const product = getProductDetails(sku?.productId || 0);
    if (!product) return 0;
    
    const taxRateMapping = mockTaxRates.find(t => t.taxRegionId === selectedTaxRegionId && t.productType === product.productType);
    if (!taxRateMapping) return 0;

    // Simplified tax calculation
    return price * taxRateMapping.taxRate;
  };

  // Calculate taxes for bundle base price (assuming bundle type)
  totalTax += calculateTax(selectedBundleId, subtotal);

  const lineItems: any[] = [];

  Object.entries(selections).forEach(([groupId, skuMap]) => {
    Object.entries(skuMap).forEach(([skuId, qty]) => {
      const pricing = getOptionPricing(Number(skuId), Number(groupId), qty);
      if (pricing) {
        subtotal += pricing.finalPrice;
        const tax = calculateTax(Number(skuId), pricing.finalPrice);
        totalTax += tax;
        lineItems.push({
          groupId: Number(groupId),
          skuId: Number(skuId),
          qty,
          pricing,
          tax
        });
      }
    });
  });

  const totalDue = subtotal + totalTax;

  // 4. Dynamic Entitlements Aggregation
  const aggregatedEntitlements = useMemo(() => {
    const result: Record<string, { name: string, type: string, value: any }> = {};
    
    allSelectedSkuIds.forEach(skuId => {
      const entitlements = mockEntitlements.filter(e => e.skuId === skuId && e.status === 'active');
      entitlements.forEach(ent => {
        const feature = mockFeatures.find(f => f.code === ent.featureCode);
        if (!feature) return;

        if (!result[feature.code]) {
          result[feature.code] = { name: feature.name, type: feature.type, value: null };
        }

        if (feature.type === 'boolean') {
          result[feature.code].value = true;
        } else if (feature.type === 'quota') {
          result[feature.code].value = (result[feature.code].value || 0) + (ent.quotaValue || 0);
        } else if (feature.type === 'tier') {
          // Simplified tier logic: Priority > Standard
          const currentTier = result[feature.code].value;
          const newTier = ent.tierValue;
          if (!currentTier || (newTier === 'Priority' && currentTier === 'Standard')) {
            result[feature.code].value = newTier;
          }
        }
      });
    });
    return result;
  }, [allSelectedSkuIds]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceBook?.currency || 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tags className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {t('cpq.title')}
          </h1>
          <p className="text-slate-500 mt-1">Configure your selected bundle</p>
        </div>
        
        {/* Bundle Switcher */}
        <div className="flex items-center gap-2">
          {bundleSkus.map(bundle => (
            <Button 
              key={bundle.id}
              variant={selectedBundleId === bundle.id ? 'primary' : 'outline'}
              onClick={() => setSelectedBundleId(bundle.id)}
              className="gap-2"
            >
              <Package className="w-4 h-4" />
              {bundle.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Global Settings: Price Book & Tax Region */}
      <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price Book</label>
          <select 
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            value={selectedPriceBookId}
            onChange={(e) => setSelectedPriceBookId(Number(e.target.value))}
          >
            {mockPriceBooks.map(pb => (
              <option key={pb.id} value={pb.id}>{pb.name} ({pb.currency})</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax Region</label>
          <select 
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            value={selectedTaxRegionId}
            onChange={(e) => setSelectedTaxRegionId(Number(e.target.value))}
          >
            {mockTaxRegions.filter(r => r.level !== 'country').map(tr => (
              <option key={tr.id} value={tr.id}>{tr.name} ({tr.regionCode})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeGroups.map(group => (
            <Card key={group.id} className="overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <Badge variant="outline">
                    {group.isMutuallyExclusive ? 'Select 1' : `Select ${group.minSelections}-${group.maxSelections}`}
                  </Badge>
                </div>
                {group.description && (
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <Info className="w-4 h-4" /> {group.description}
                  </p>
                )}
              </div>
              <div className="p-6 space-y-3">
                {activeOptions.filter(opt => opt.groupId === group.id).map(option => {
                  const sku = getSkuDetails(option.componentSkuId);
                  const isSelected = !!(selections[group.id] && selections[group.id][option.componentSkuId]);
                  const qty = isSelected ? selections[group.id][option.componentSkuId] : 1;
                  const pricing = getOptionPricing(option.componentSkuId, group.id, qty);
                  
                  const isRecommended = recommendedSkuIds.has(option.componentSkuId);
                  const isDisabled = disabledSkuIds.has(option.componentSkuId);
                  const ruleError = ruleMessages.find(r => r.skuId === option.componentSkuId);

                  return (
                    <div key={option.id} className="space-y-2">
                      <div 
                        onClick={() => !isDisabled && handleSelect(group.id, option.componentSkuId, group.isMutuallyExclusive)}
                        className={`
                          relative flex items-center p-4 rounded-xl border-2 transition-all
                          ${isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800' : 'cursor-pointer'}
                          ${isSelected 
                            ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-500/10' 
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'}
                          ${ruleError ? 'border-red-500 dark:border-red-500' : ''}
                        `}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-slate-50">{sku?.name}</span>
                            {isRecommended && !isSelected && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            {sku?.billingModel === 'recurring' ? `${sku.billingModel} (${sku.billingTerm})` : sku?.billingModel}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Quantity Selector for allowed items */}
                          {isSelected && group.allowMultipleQtyPerItem && (
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1" onClick={e => e.stopPropagation()}>
                              <button 
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                onClick={() => handleQuantityChange(group.id, option.componentSkuId, -1)}
                              >-</button>
                              <span className="text-sm font-medium w-4 text-center">{qty}</span>
                              <button 
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                onClick={() => handleQuantityChange(group.id, option.componentSkuId, 1)}
                              >+</button>
                            </div>
                          )}

                          <div className={`text-sm font-medium ${pricing?.type === 'included' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {pricing?.type === 'included' ? 'Included' : formatCurrency(pricing?.finalPrice || 0)}
                            {qty > 1 && <span className="text-xs text-slate-400 block text-right">({formatCurrency(pricing?.unitPrice || 0)} ea)</span>}
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                          )}
                        </div>
                      </div>
                      
                      {/* Rule Error Message */}
                      {ruleError && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 px-2">
                          <AlertTriangle className="w-4 h-4" />
                          {ruleError.message}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-6 space-y-6">
            {/* Quote Summary */}
            <Card className="border-indigo-200 dark:border-indigo-900/50 shadow-lg shadow-indigo-100 dark:shadow-none">
              <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/20">
                <CardTitle>Quote Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm font-medium pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex-1 pr-4">
                      <div className="text-slate-900 dark:text-slate-50">{getSkuDetails(selectedBundleId)?.name}</div>
                      <div className="text-xs text-slate-400">Base Price</div>
                    </div>
                    <div className="text-slate-900 dark:text-slate-50">
                      {formatCurrency(bundleBasePriceEntry?.listPrice || 0)}
                    </div>
                  </div>
                  
                  {lineItems.map((item, idx) => {
                    const sku = getSkuDetails(item.skuId);
                    const group = activeGroups.find(g => g.id === item.groupId);
                    return (
                      <div key={idx} className="flex justify-between text-sm">
                        <div className="flex-1 pr-4">
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {sku?.name} {item.qty > 1 ? `x${item.qty}` : ''}
                          </div>
                          <div className="text-xs text-slate-400">{group?.name}</div>
                        </div>
                        <div className="font-medium text-slate-900 dark:text-slate-50">
                          {item.pricing.type === 'included' ? 'Included' : formatCurrency(item.pricing.finalPrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Estimated Tax</span>
                    <span>{formatCurrency(totalTax)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 mb-6">
                    <div className="text-slate-900 dark:text-slate-50 font-medium">Total Due Today</div>
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(totalDue)}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gap-2 text-lg h-12"
                    disabled={ruleMessages.length > 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t('cpq.addToQuote')}
                  </Button>
                  {ruleMessages.length > 0 && (
                    <p className="text-xs text-red-500 text-center mt-2">Please resolve configuration errors before proceeding.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Entitlements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Unlocked Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(aggregatedEntitlements as Record<string, { name: string, type: string, value: any }>).map(([code, feature]) => (
                    <div key={code} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{feature.name}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        {feature.type === 'boolean' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          feature.value
                        )}
                      </span>
                    </div>
                  ))}
                  {Object.keys(aggregatedEntitlements).length === 0 && (
                    <div className="text-sm text-slate-500 text-center py-4">
                      No features unlocked yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

