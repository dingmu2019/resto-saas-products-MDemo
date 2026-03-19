import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Tags, CheckCircle2, Circle, ShoppingCart, Info, Package, AlertTriangle, ShieldCheck } from 'lucide-react';

export function CPQDemo() {
  const { t } = useTranslation();
  const { 
    products, skus, bundleGroups, bundleOptions, 
    priceBooks, priceBookEntries, taxRegions, taxRates, 
    rules, entitlements, features 
  } = useProductContext();
  
  // Settings
  const [selectedBundleId, setSelectedBundleId] = useState<number>(1041);
  const [selectedPriceBookId, setSelectedPriceBookId] = useState<number>(1);
  const [selectedTaxRegionId, setSelectedTaxRegionId] = useState<number>(2); // Default to CA

  const bundleSkus = skus.filter(s => s.uom === 'Bundle');
  const activeGroups = bundleGroups.filter(g => g.bundleSkuId === selectedBundleId);
  const activeOptions = bundleOptions.filter(o => o.bundleSkuId === selectedBundleId);
  const priceBook = priceBooks.find(pb => pb.id === selectedPriceBookId);

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
  }, [selectedBundleId, activeGroups.length]);

  // 4. Excludes Rule Deadlock Fix: Auto-remove conflicting targets
  const resolveConflicts = (newSelections: Record<number, Record<number, number>>) => {
    const allSelectedSkuIds = Object.values(newSelections).flatMap(group => Object.keys(group).map(Number));
    const toRemove = new Set<number>();

    rules.forEach(rule => {
      if (rule.ruleType === 'excludes' && allSelectedSkuIds.includes(rule.sourceSkuId)) {
        toRemove.add(rule.targetSkuId);
      }
    });

    if (toRemove.size > 0) {
      const resolvedSelections = { ...newSelections };
      Object.keys(resolvedSelections).forEach(groupId => {
        const groupNum = Number(groupId);
        resolvedSelections[groupNum] = { ...resolvedSelections[groupNum] };
        toRemove.forEach(skuId => {
          if (resolvedSelections[groupNum][skuId]) {
            delete resolvedSelections[groupNum][skuId];
          }
        });
      });
      return resolvedSelections;
    }
    return newSelections;
  };

  // 3. Max Selections Bypass Fix: Calculate total quantity in a group
  const getGroupTotalQty = (groupId: number, currentSelections: Record<number, Record<number, number>>) => {
    const groupSelections = currentSelections[groupId] || {};
    return Object.values(groupSelections).reduce((sum, qty) => sum + qty, 0);
  };

  const handleSelect = (groupId: number, skuId: number, isMutuallyExclusive: boolean) => {
    setSelections(prev => {
      const group = activeGroups.find(g => g.id === groupId);
      if (!group) return prev;

      const currentGroupSelections = { ...prev[groupId] };
      const currentTotalQty = getGroupTotalQty(groupId, prev);
      
      if (isMutuallyExclusive) {
        const newSelections = { ...prev, [groupId]: { [skuId]: 1 } };
        return resolveConflicts(newSelections);
      } else {
        if (currentGroupSelections[skuId]) {
          delete currentGroupSelections[skuId];
        } else {
          // Check maxSelections before adding a new item
          if (currentTotalQty >= group.maxSelections) {
            return prev; // Block selection
          }
          currentGroupSelections[skuId] = 1;
        }
        const newSelections = { ...prev, [groupId]: currentGroupSelections };
        return resolveConflicts(newSelections);
      }
    });
  };

  const handleQuantityChange = (groupId: number, skuId: number, delta: number) => {
    setSelections(prev => {
      const group = activeGroups.find(g => g.id === groupId);
      if (!group) return prev;

      const currentGroupSelections = { ...prev[groupId] };
      const currentQty = currentGroupSelections[skuId] || 0;
      const currentTotalQty = getGroupTotalQty(groupId, prev);
      
      const newQty = Math.max(1, currentQty + delta);
      
      // Check maxSelections before increasing quantity
      if (delta > 0 && currentTotalQty >= group.maxSelections) {
        return prev; // Block increase
      }

      currentGroupSelections[skuId] = newQty;
      return { ...prev, [groupId]: currentGroupSelections };
    });
  };

  // 1. Product Rules Enforcement (Visuals only, conflicts auto-resolved above)
  const allSelectedSkuIds = Object.values(selections).flatMap(group => Object.keys(group).map(Number));
  
  const ruleMessages: { skuId: number, type: string, message: string }[] = [];
  const recommendedSkuIds = new Set<number>();
  const disabledSkuIds = new Set<number>();

  rules.forEach(rule => {
    const sourceSelected = allSelectedSkuIds.includes(rule.sourceSkuId);
    const targetSelected = allSelectedSkuIds.includes(rule.targetSkuId);

    if (sourceSelected) {
      if (rule.ruleType === 'requires' && !targetSelected) {
        ruleMessages.push({ skuId: rule.sourceSkuId, type: 'error', message: rule.message || `Requires SKU ${rule.targetSkuId}` });
      }
      if (rule.ruleType === 'excludes') {
        disabledSkuIds.add(rule.targetSkuId); // Disable the target visually
      }
      if (rule.ruleType === 'recommends' && !targetSelected) {
        recommendedSkuIds.add(rule.targetSkuId);
      }
    }
  });

  const getSkuDetails = (skuId: number) => skus.find(s => s.id === skuId);
  const getProductDetails = (productId: number) => products.find(p => p.id === productId);

  // 5. Tiered vs Volume Pricing Fix
  const getOptionPricing = (skuId: number, groupId: number, qty: number = 1) => {
    const option = activeOptions.find(o => o.componentSkuId === skuId && o.groupId === groupId);
    if (!option) return null;
    
    const basePriceEntry = priceBookEntries.find(e => e.skuId === skuId && e.priceBookId === selectedPriceBookId);
    
    let basePrice = basePriceEntry?.listPrice || 0;
    let finalPrice = basePrice * qty;
    
    if (basePriceEntry?.pricingStrategy === 'volume' && basePriceEntry.tierConfig) {
      // Volume: All units get the price of the matched tier
      const tier = basePriceEntry.tierConfig.find((t: any) => qty >= t.minQty && qty <= t.maxQty);
      if (tier) {
        basePrice = tier.price;
        finalPrice = basePrice * qty;
      }
    } else if (basePriceEntry?.pricingStrategy === 'tiered' && basePriceEntry.tierConfig) {
      // Tiered: Progressive calculation
      finalPrice = 0;
      let remainingQty = qty;
      
      // Sort tiers by minQty to ensure correct progressive calculation
      const sortedTiers = [...basePriceEntry.tierConfig].sort((a, b) => a.minQty - b.minQty);
      
      for (const tier of sortedTiers) {
        if (remainingQty <= 0) break;
        
        const tierMaxQty = tier.maxQty === 9999 ? Infinity : tier.maxQty;
        const tierCapacity = tierMaxQty - tier.minQty + 1;
        const qtyInTier = Math.min(remainingQty, tierCapacity);
        
        if (qtyInTier > 0) {
          finalPrice += qtyInTier * tier.price;
          remainingQty -= qtyInTier;
        }
      }
      // Calculate effective unit price for display
      basePrice = qty > 0 ? finalPrice / qty : 0;
    }

    let unitPrice = basePrice;
    let type: 'included' | 'fixed_override' | 'price_adjustment' | 'standard' = 'standard';

    switch (option.pricingType) {
      case 'included':
        unitPrice = 0;
        finalPrice = 0;
        type = 'included';
        break;
      case 'fixed_override':
        unitPrice = option.pricingValue || 0;
        finalPrice = unitPrice * qty;
        type = 'fixed_override';
        break;
      case 'price_adjustment':
        unitPrice = basePrice + (option.pricingValue || 0);
        finalPrice = unitPrice * qty;
        type = 'price_adjustment';
        break;
    }

    return { unitPrice, finalPrice, type };
  };

  // 2. Tax Inclusive vs Exclusive Fix
  const calculateTax = (skuId: number, price: number) => {
    const sku = getSkuDetails(skuId);
    const product = getProductDetails(sku?.productId || 0);
    if (!product) return { taxAmount: 0, priceWithoutTax: price, isInclusive: false };
    
    const taxRateMapping = taxRates.find(t => t.taxRegionId === selectedTaxRegionId && t.productType === product.productType);
    if (!taxRateMapping) return { taxAmount: 0, priceWithoutTax: price, isInclusive: false };

    if (taxRateMapping.isTaxInclusive) {
      // Reverse calculation: Price = Base + (Base * Rate) => Base = Price / (1 + Rate)
      const priceWithoutTax = price / (1 + taxRateMapping.taxRate);
      const taxAmount = price - priceWithoutTax;
      return { taxAmount, priceWithoutTax, isInclusive: true };
    } else {
      // Standard calculation: Tax = Price * Rate
      const taxAmount = price * taxRateMapping.taxRate;
      return { taxAmount, priceWithoutTax: price, isInclusive: false };
    }
  };

  // 1. Billing Model Mismatch Fix: Separate totals by billing term
  const bundleBasePriceEntry = priceBookEntries.find(e => e.skuId === selectedBundleId && e.priceBookId === selectedPriceBookId);
  const bundleSku = getSkuDetails(selectedBundleId);
  
  const totals = {
    one_time: { subtotal: 0, tax: 0 },
    monthly: { subtotal: 0, tax: 0 },
    annual: { subtotal: 0, tax: 0 }
  };

  const addAmountToTotals = (sku: any, amount: number, tax: number) => {
    if (!sku) return;
    if (sku.billingModel === 'one_time' || sku.billingModel === 'usage_based') {
      totals.one_time.subtotal += amount;
      totals.one_time.tax += tax;
    } else if (sku.billingModel === 'recurring') {
      if (sku.billingTerm === 'monthly') {
        totals.monthly.subtotal += amount;
        totals.monthly.tax += tax;
      } else if (sku.billingTerm === 'annual') {
        totals.annual.subtotal += amount;
        totals.annual.tax += tax;
      }
    }
  };

  // Add bundle base price to totals
  if (bundleBasePriceEntry && bundleSku) {
    const taxInfo = calculateTax(selectedBundleId, bundleBasePriceEntry.listPrice);
    addAmountToTotals(bundleSku, taxInfo.priceWithoutTax, taxInfo.taxAmount);
  }

  const lineItems: any[] = [];

  Object.entries(selections).forEach(([groupId, skuMap]) => {
    Object.entries(skuMap).forEach(([skuId, qty]) => {
      const sku = getSkuDetails(Number(skuId));
      const pricing = getOptionPricing(Number(skuId), Number(groupId), qty);
      
      if (pricing && sku) {
        const taxInfo = calculateTax(Number(skuId), pricing.finalPrice);
        addAmountToTotals(sku, taxInfo.priceWithoutTax, taxInfo.taxAmount);
        
        lineItems.push({
          groupId: Number(groupId),
          skuId: Number(skuId),
          qty,
          pricing,
          taxInfo,
          billingModel: sku.billingModel,
          billingTerm: sku.billingTerm
        });
      }
    });
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceBook?.currency || 'USD'
    }).format(amount);
  };

  // Dynamic Entitlements Aggregation
  const aggregatedEntitlements = useMemo(() => {
    const result: Record<string, { name: string, type: string, value: any }> = {};
    
    allSelectedSkuIds.forEach(skuId => {
      const skuEntitlements = entitlements.filter(e => e.skuId === skuId && e.status === 'active');
      skuEntitlements.forEach(ent => {
        const feature = features.find(f => f.code === ent.featureCode);
        if (!feature) return;

        if (!result[feature.code]) {
          result[feature.code] = { name: feature.name, type: feature.type, value: null };
        }

        if (feature.type === 'boolean') {
          result[feature.code].value = true;
        } else if (feature.type === 'quota') {
          result[feature.code].value = (result[feature.code].value || 0) + (ent.quotaValue || 0);
        } else if (feature.type === 'tier') {
          const currentTier = result[feature.code].value;
          const newTier = ent.tierValue;
          if (!currentTier || (newTier === 'Priority' && currentTier === 'Standard')) {
            result[feature.code].value = newTier;
          }
        }
      });
    });
    return result;
  }, [allSelectedSkuIds, entitlements, features]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tags className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {t('cpq.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('cpq.subtitle')}</p>
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('cpq.priceBook')}</label>
          <select 
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            value={selectedPriceBookId}
            onChange={(e) => setSelectedPriceBookId(Number(e.target.value))}
          >
            {priceBooks.map(pb => (
              <option key={pb.id} value={pb.id}>{pb.name} ({pb.currency})</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('cpq.taxRegion')}</label>
          <select 
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            value={selectedTaxRegionId}
            onChange={(e) => setSelectedTaxRegionId(Number(e.target.value))}
          >
            {taxRegions.filter(r => r.level !== 'country').map(tr => (
              <option key={tr.id} value={tr.id}>{tr.name} ({tr.regionCode})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeGroups.map(group => {
            const currentTotalQty = getGroupTotalQty(group.id, selections);
            const isAtMax = currentTotalQty >= group.maxSelections;

            return (
              <Card key={group.id} className="overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <Badge variant={isAtMax ? "secondary" : "outline"} className={isAtMax ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" : ""}>
                      {group.isMutuallyExclusive ? t('cpq.singleSelect') : `${t('cpq.selected')} ${currentTotalQty}/${group.maxSelections}`}
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
                    const isDisabled = disabledSkuIds.has(option.componentSkuId) || (!isSelected && isAtMax && !group.isMutuallyExclusive);
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
                                  {t('cpq.recommended')}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              {sku?.billingModel === 'recurring' ? `${t(`sku.${sku.billingModel}`)} (${t(`sku.${sku.billingTerm}`)})` : t(`sku.${sku?.billingModel}`)}
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
                                  className={`w-6 h-6 flex items-center justify-center rounded ${isAtMax ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                  onClick={() => handleQuantityChange(group.id, option.componentSkuId, 1)}
                                  disabled={isAtMax}
                                >+</button>
                              </div>
                            )}

                            <div className={`text-sm font-medium ${pricing?.type === 'included' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {pricing?.type === 'included' ? t('cpq.included') : formatCurrency(pricing?.finalPrice || 0)}
                              {qty > 1 && <span className="text-xs text-slate-400 block text-right">({formatCurrency(pricing?.unitPrice || 0)} /{t('cpq.unit')})</span>}
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
            );
          })}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-6 space-y-6">
            {/* Quote Summary */}
            <Card className="border-indigo-200 dark:border-indigo-900/50 shadow-lg shadow-indigo-100 dark:shadow-none">
              <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/20">
                <CardTitle>{t('cpq.quoteSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6 mb-6">
                  
                  {/* Monthly Recurring */}
                  {totals.monthly.subtotal > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('cpq.monthlySubscription')}</h4>
                      {lineItems.filter(i => i.billingTerm === 'monthly').map((item, idx) => {
                        const sku = getSkuDetails(item.skuId);
                        return (
                          <div key={idx} className="flex justify-between text-sm">
                            <div className="flex-1 pr-4">
                              <div className="font-medium text-slate-700 dark:text-slate-300">
                                {sku?.name} {item.qty > 1 ? `x${item.qty}` : ''}
                              </div>
                            </div>
                            <div className="font-medium text-slate-900 dark:text-slate-50">
                              {item.pricing.type === 'included' ? t('cpq.included') : formatCurrency(item.pricing.finalPrice)}
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-between text-sm font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">{t('cpq.monthlyTotalExclTax')}</span>
                        <span>{formatCurrency(totals.monthly.subtotal)}</span>
                      </div>
                    </div>
                  )}

                  {/* Annual Recurring */}
                  {totals.annual.subtotal > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('cpq.annualSubscription')}</h4>
                      {lineItems.filter(i => i.billingTerm === 'annual').map((item, idx) => {
                        const sku = getSkuDetails(item.skuId);
                        return (
                          <div key={idx} className="flex justify-between text-sm">
                            <div className="flex-1 pr-4">
                              <div className="font-medium text-slate-700 dark:text-slate-300">
                                {sku?.name} {item.qty > 1 ? `x${item.qty}` : ''}
                              </div>
                            </div>
                            <div className="font-medium text-slate-900 dark:text-slate-50">
                              {item.pricing.type === 'included' ? t('cpq.included') : formatCurrency(item.pricing.finalPrice)}
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-between text-sm font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">{t('cpq.annualTotalExclTax')}</span>
                        <span>{formatCurrency(totals.annual.subtotal)}</span>
                      </div>
                    </div>
                  )}

                  {/* One-Time Fees */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('cpq.oneTimeFees')}</h4>
                    <div className="flex justify-between text-sm">
                      <div className="flex-1 pr-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{getSkuDetails(selectedBundleId)?.name}</div>
                        <div className="text-xs text-slate-400">{t('cpq.basePrice')}</div>
                      </div>
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {formatCurrency(bundleBasePriceEntry?.listPrice || 0)}
                      </div>
                    </div>
                    {lineItems.filter(i => i.billingModel === 'one_time' || i.billingModel === 'usage_based').map((item, idx) => {
                      const sku = getSkuDetails(item.skuId);
                      return (
                        <div key={idx} className="flex justify-between text-sm">
                          <div className="flex-1 pr-4">
                            <div className="font-medium text-slate-700 dark:text-slate-300">
                              {sku?.name} {item.qty > 1 ? `x${item.qty}` : ''}
                            </div>
                          </div>
                          <div className="font-medium text-slate-900 dark:text-slate-50">
                            {item.pricing.type === 'included' ? t('cpq.included') : formatCurrency(item.pricing.finalPrice)}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between text-sm font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{t('cpq.oneTimeTotalExclTax')}</span>
                      <span>{formatCurrency(totals.one_time.subtotal)}</span>
                    </div>
                  </div>

                </div>
                
                <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{t('cpq.subtotal')}</span>
                    <span>{formatCurrency(totals.one_time.subtotal + totals.monthly.subtotal + totals.annual.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{t('cpq.estimatedTax')}</span>
                    <span>{formatCurrency(totals.one_time.tax + totals.monthly.tax + totals.annual.tax)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 mb-6">
                    <div className="text-slate-900 dark:text-slate-50 font-medium">{t('cpq.totalDueToday')}</div>
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(totals.one_time.subtotal + totals.one_time.tax)}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gap-2 text-lg h-12"
                    size="lg"
                    disabled={ruleMessages.length > 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t('cpq.addToQuote')}
                  </Button>
                  {ruleMessages.length > 0 && (
                    <p className="text-xs text-red-500 text-center mt-2">{t('cpq.resolveErrors')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Entitlements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  {t('cpq.unlockedFeatures')}
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
                      {t('cpq.noFeatures')}
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

