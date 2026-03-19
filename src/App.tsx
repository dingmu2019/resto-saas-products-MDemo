/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppProvider';
import { ProductProvider } from './contexts/ProductProvider';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Skus } from './pages/Skus';
import { PriceBooks } from './pages/PriceBooks';
import { Categories } from './pages/Categories';
import { CPQDemo } from './pages/CPQDemo';
import { Taxes } from './pages/Taxes';
import { ProductRules } from './pages/ProductRules';
import { Features } from './pages/Features';
import { MediaLibrary } from './pages/MediaLibrary';
import { Bundles } from './pages/Bundles';
import { DataModels } from './pages/DataModels';
import './i18n';

export default function App() {
  return (
    <AppProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="skus" element={<Skus />} />
              <Route path="bundles" element={<Bundles />} />
              <Route path="features" element={<Features />} />
              <Route path="rules" element={<ProductRules />} />
              <Route path="taxes" element={<Taxes />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="price-books" element={<PriceBooks />} />
              <Route path="categories" element={<Categories />} />
              <Route path="cpq" element={<CPQDemo />} />
              <Route path="data-models" element={<DataModels />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </AppProvider>
  );
}
