'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CartProvider, useCart, useCartActions } from '@/lib/ordering/cart'
import { canDineIn, canPreOrder } from '@/lib/ordering/tier'
import { BusinessData } from '../templates/types'
import CartFAB from './CartFAB'
import CartDrawer from './CartDrawer'
import CheckoutSheet from './CheckoutSheet'
import OrderModeSelector from './OrderModeSelector'
import ClaimBanner from './ClaimBanner'

interface OrderingWrapperProps {
  business: BusinessData & { id?: string }
  accentColor: string
  children: React.ReactNode
}

function OrderingInner({ business, accentColor, children }: OrderingWrapperProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { state, itemCount } = useCart()
  const { setOrderMode, setTable } = useCartActions()
  const searchParams = useSearchParams()

  const tier = business.subscriptionType || 'free'
  const businessId = (business as unknown as Record<string, string>).id || ''
  const isFree = !business.subscriptionType || business.subscriptionType === 'free'
  const showDineIn = canDineIn(tier)
  const showPreOrder = canPreOrder(tier)

  // Read ?table=N from URL on mount
  useEffect(() => {
    const tableParam = searchParams.get('table')
    if (tableParam && showDineIn) {
      setTable(tableParam)
      // Auto-activate dine-in mode for UMKM tier (no mode selector)
      if (!showPreOrder) {
        setOrderMode('dine-in')
      }
    }
  }, [searchParams, showDineIn, showPreOrder, setTable, setOrderMode])

  // For free tier: show claim banner + render children as-is
  if (isFree) {
    return (
      <div>
        {businessId && <ClaimBanner businessId={businessId} />}
        <div className={businessId ? 'pt-10' : ''}>
          {children}
        </div>
      </div>
    )
  }

  const isOrderingActive = state.orderMode !== null
  const hideDefaultWA = itemCount > 0

  return (
    <div>
      {/* Order mode selector — only for Business tier when table is set */}
      {showPreOrder && state.tableNumber && (
        <OrderModeSelector accentColor={accentColor} />
      )}

      {/* Render template children, passing ordering state via CSS class */}
      <div
        className={hideDefaultWA ? 'ordering-active' : ''}
        style={showPreOrder && state.tableNumber ? { paddingTop: '52px' } : undefined}
      >
        {children}
      </div>

      {/* Cart FAB — replaces StickyWA position when items in cart */}
      <CartFAB onClick={() => setDrawerOpen(true)} accentColor={accentColor} />

      {/* Cart drawer */}
      <CartDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCheckout={() => {
          setDrawerOpen(false)
          setCheckoutOpen(true)
        }}
        accentColor={accentColor}
      />

      {/* Checkout sheet */}
      <CheckoutSheet
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        business={business}
        businessId={businessId}
        accentColor={accentColor}
      />

      {/* Hide StickyWA when cart has items */}
      {hideDefaultWA && (
        <style>{`.ordering-active a[aria-label="Chat WhatsApp"] { display: none !important; }`}</style>
      )}
    </div>
  )
}

export default function OrderingWrapper(props: OrderingWrapperProps) {
  const businessId = (props.business as unknown as Record<string, string>).id || 'unknown'

  return (
    <CartProvider businessId={businessId}>
      <OrderingInner {...props} />
    </CartProvider>
  )
}

// Re-export for use in Layouts
export { useCart, useCartActions } from '@/lib/ordering/cart'
