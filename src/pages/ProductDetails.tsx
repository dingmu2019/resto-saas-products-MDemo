import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockProducts, mockSkus, mockEntitlements } from '../data/mock';
import { ArrowLeft, Box, Shield, FileText } from 'lucide-react';

export function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  
  const product = mockProducts.find(p => p.id === Number(id));
  const skus = mockSkus.filter(s => s.productId === Number(id));

  if (!product) return <div className="p-8 text-center text-slate-500">{t('common.noData')}</div>;

  const getLifecycleBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">{t('sku.active')}</Badge>;
      case 'draft': return <Badge variant="warning">{t('sku.draft')}</Badge>;
      case 'eos': return <Badge variant="error">{t('sku.eos')}</Badge>;
      case 'eol': return <Badge variant="error">{t('sku.eol')}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products">
          <Button variant="ghost" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-slate-500 font-mono mt-1">{product.productCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5" />
                {t('product.skuList')}
              </CardTitle>
            </CardHeader>
            <Table>
              <Thead>
                <Tr>
                  <Th>{t('sku.code')}</Th>
                  <Th>{t('sku.name')}</Th>
                  <Th>{t('sku.billingModel')}</Th>
                  <Th>{t('sku.billingTerm')}</Th>
                  <Th>{t('sku.lifecycle')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {skus.map((sku) => (
                  <Tr key={sku.id}>
                    <Td className="font-mono text-xs text-slate-500">{sku.skuCode}</Td>
                    <Td className="font-medium">{sku.name}</Td>
                    <Td className="text-slate-500">{t(`sku.${sku.billingModel}`)}</Td>
                    <Td className="text-slate-500 capitalize">{sku.billingTerm !== 'none' ? sku.billingTerm : '-'}</Td>
                    <Td>{getLifecycleBadge(sku.lifecycleStatus)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>

          {product.productType === 'software' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('product.entitlements')}
                </CardTitle>
              </CardHeader>
              <Table>
                <Thead>
                  <Tr>
                    <Th>SKU</Th>
                    <Th>{t('features.code')}</Th>
                    <Th>{t('features.type')}</Th>
                    <Th>Value</Th>
                    <Th>{t('common.status')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mockEntitlements.filter(e => skus.some(s => s.id === e.skuId)).map((ent) => {
                    const sku = skus.find(s => s.id === ent.skuId);
                    return (
                      <Tr key={ent.id}>
                        <Td className="font-mono text-xs text-slate-500">{sku?.skuCode}</Td>
                        <Td className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{ent.featureCode}</Td>
                        <Td><Badge variant="outline">{t(`features.${ent.entitlementType}`)}</Badge></Td>
                        <Td className="font-medium">{ent.quotaValue || ent.tierValue || '-'}</Td>
                        <Td><Badge variant={ent.status === 'active' ? 'success' : 'default'}>{ent.status === 'active' ? t('common.active') : t('common.inactive')}</Badge></Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('product.description')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {product.description}
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 text-sm">{t('product.type')}</span>
                  <span className="font-medium text-sm capitalize">{t(`product.${product.productType}`)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 text-sm">{t('product.brand')}</span>
                  <span className="font-medium text-sm">{product.brand || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
