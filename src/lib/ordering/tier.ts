export type SubscriptionTier = 'free' | 'umkm' | 'business'

export function canDineIn(tier?: SubscriptionTier | string): boolean {
  return tier === 'umkm' || tier === 'business'
}

export function canPreOrder(tier?: SubscriptionTier | string): boolean {
  return tier === 'business'
}

export function hasPaymentConfig(tier?: SubscriptionTier | string): boolean {
  return tier === 'business'
}
