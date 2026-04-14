import React, { createContext, useContext, useState } from 'react';
import { Product, ProductSku, Category, PriceBook, PriceBookEntry, ProductMedia, ProductEntitlement, BundleGroup, BundleOption, ProductRule, TaxRateFlat, ProductFeature } from '../types';
import { mockData } from '../data/mock';

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
  taxRates: TaxRateFlat[];
  setTaxRates: React.Dispatch<React.SetStateAction<TaxRateFlat[]>>;
  features: ProductFeature[];
  setFeatures: React.Dispatch<React.SetStateAction<ProductFeature[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockData.products);
  const [skus, setSkus] = useState<ProductSku[]>(mockData.skus as ProductSku[]);
  const [categories, setCategories] = useState<Category[]>(mockData.categories);
  const [priceBooks, setPriceBooks] = useState<PriceBook[]>(mockData.priceBooks);
  const [priceBookEntries, setPriceBookEntries] = useState<PriceBookEntry[]>(mockData.priceBookEntries);
  const [media, setMedia] = useState<ProductMedia[]>(mockData.media);
  const [entitlements, setEntitlements] = useState<ProductEntitlement[]>(mockData.entitlements);
  const [bundleGroups, setBundleGroups] = useState<BundleGroup[]>(mockData.bundleGroups);
  const [bundleOptions, setBundleOptions] = useState<BundleOption[]>(mockData.bundleOptions);
  const [rules, setRules] = useState<ProductRule[]>(mockData.rules);
  const [taxRates, setTaxRates] = useState<TaxRateFlat[]>(mockData.taxRates);
  const [features, setFeatures] = useState<ProductFeature[]>(mockData.features);

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
