export type SubscriptionTier = 'free' | 'umkm' | 'business'

export function canDineIn(tier?: SubscriptionTier | string): boolean {
  return tier === 'umkm' || tier === 'business'
}

/** Universal ordering check — all paid tiers can accept orders */
export const canOrder = canDineIn

export function canPreOrder(tier?: SubscriptionTier | string): boolean {
  return tier === 'business'
}

export function hasPaymentConfig(tier?: SubscriptionTier | string): boolean {
  return tier === 'business'
}
