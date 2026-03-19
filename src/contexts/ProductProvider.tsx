import React, { createContext, useContext, useState } from 'react';
import { Product, ProductSku, Category, PriceBook, PriceBookEntry, ProductMedia, ProductEntitlement, BundleGroup, BundleOption, ProductRule, TaxRegion, TaxRateMapping, ProductFeature } from '../types';
import { mockProducts, mockSkus, mockCategories, mockPriceBooks, mockPriceBookEntries, mockMedia, mockEntitlements, mockBundleGroups, mockBundleOptions, mockRules, mockTaxRegions, mockTaxRates, mockFeatures } from '../data/mock';

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  skus: ProductSku[];
  setSkus: React.Dispatch<React.SetStateAction<ProductSku[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  priceBooks: PriceBook[];
  setPriceBooks: React.Dispatch<React.SetStateAction<PriceBook[]>>;
  priceBookEntries: PriceBookEntry[];
  setPriceBookEntries: React.Dispatch<React.SetStateAction<PriceBookEntry[]>>;
  media: ProductMedia[];
  setMedia: React.Dispatch<React.SetStateAction<ProductMedia[]>>;
  entitlements: ProductEntitlement[];
  setEntitlements: React.Dispatch<React.SetStateAction<ProductEntitlement[]>>;
  bundleGroups: BundleGroup[];
  setBundleGroups: React.Dispatch<React.SetStateAction<BundleGroup[]>>;
  bundleOptions: BundleOption[];
  setBundleOptions: React.Dispatch<React.SetStateAction<BundleOption[]>>;
  rules: ProductRule[];
  setRules: React.Dispatch<React.SetStateAction<ProductRule[]>>;
  taxRegions: TaxRegion[];
  setTaxRegions: React.Dispatch<React.SetStateAction<TaxRegion[]>>;
  taxRates: TaxRateMapping[];
  setTaxRates: React.Dispatch<React.SetStateAction<TaxRateMapping[]>>;
  features: ProductFeature[];
  setFeatures: React.Dispatch<React.SetStateAction<ProductFeature[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [skus, setSkus] = useState<ProductSku[]>(mockSkus);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [priceBooks, setPriceBooks] = useState<PriceBook[]>(mockPriceBooks);
  const [priceBookEntries, setPriceBookEntries] = useState<PriceBookEntry[]>(mockPriceBookEntries);
  const [media, setMedia] = useState<ProductMedia[]>(mockMedia);
  const [entitlements, setEntitlements] = useState<ProductEntitlement[]>(mockEntitlements);
  const [bundleGroups, setBundleGroups] = useState<BundleGroup[]>(mockBundleGroups);
  const [bundleOptions, setBundleOptions] = useState<BundleOption[]>(mockBundleOptions);
  const [rules, setRules] = useState<ProductRule[]>(mockRules);
  const [taxRegions, setTaxRegions] = useState<TaxRegion[]>(mockTaxRegions);
  const [taxRates, setTaxRates] = useState<TaxRateMapping[]>(mockTaxRates);
  const [features, setFeatures] = useState<ProductFeature[]>(mockFeatures);

  return (
    <ProductContext.Provider value={{
      products, setProducts,
      skus, setSkus,
      categories, setCategories,
      priceBooks, setPriceBooks,
      priceBookEntries, setPriceBookEntries,
      media, setMedia,
      entitlements, setEntitlements,
      bundleGroups, setBundleGroups,
      bundleOptions, setBundleOptions,
      rules, setRules,
      taxRegions, setTaxRegions,
      taxRates, setTaxRates,
      features, setFeatures
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
