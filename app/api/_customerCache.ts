export type CacheCategory = 'demographics' | 'assets' | 'agtech_safe' | 'psychometric_info';

interface CustomerCacheRecord {
  demographics?: any;
  assets?: any;
  agtech_safe?: any;
  psychometric_info?: any;
  updatedAt?: number;
}

const customerCache = new Map<string, CustomerCacheRecord>();

export function setCustomerCache(customerId: string, category: CacheCategory, data: any) {
  const existing = customerCache.get(customerId) || {};
  const nextRecord: CustomerCacheRecord = { ...existing, [category]: data, updatedAt: Date.now() };
  customerCache.set(customerId, nextRecord);
}

export function getCustomerCache(customerId: string, category?: CacheCategory) {
  const record = customerCache.get(customerId);
  if (!record) return undefined;
  return category ? (record as any)[category] : record;
}

export function clearCustomerCache(customerId?: string) {
  if (!customerId) {
    customerCache.clear();
    return;
  }
  customerCache.delete(customerId);
} 