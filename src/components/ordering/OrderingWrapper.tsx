'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CartProvider, useCart, useCartActions } from '@/lib/ordering/cart'
import { canOrder, canPreOrder } from '@/lib/ordering/tier'

import { BusinessData } from '../templates/types'
import CartFAB from './CartFAB'
import CartDrawer from './CartDrawer'
import CheckoutSheet from './CheckoutSheet'
import OrderModeSelector from './OrderModeSelector'
import ClaimBanner from './ClaimBanner'

interface OrderingWrapperProps {
  business: BusinessData & { id?: string }
  accentColor: string
  category: string
  children: React.ReactNode
}

function OrderingInner({ business, accentColor, category, children }: OrderingWrapperProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { state, itemCount } = useCart()
  const { setOrderMode, setTable } = useCartActions()
  const searchParams = useSearchParams()

  const tier = business.subscriptionType || 'free'
  const businessId = (business as unknown as Record<string, string>).id || ''
  const isFree = !business.subscriptionType || business.subscriptionType === 'free'
  const isKuliner = category === 'kuliner'
  const isKulinerRumahan = category === 'kuliner_rumahan'

  const canOrderTier = canOrder(tier)
  const showPreOrder = canPreOrder(tier)

  // Read ?table=N from URL on mount (kuliner only)
  useEffect(() => {
    if (!isKuliner) return
    const tableParam = searchParams.get('table')
    if (tableParam && canOrderTier) {
      setTable(tableParam)
      // Auto-activate langsung mode for UMKM tier (no mode selector)
      if (!showPreOrder) {
        setOrderMode('langsung')
      }
    }
  }, [searchParams, isKuliner, canOrderTier, showPreOrder, setTable, setOrderMode])

  // Non-kuliner + kuliner_rumahan: auto-activate pesan-dulu on mount
  useEffect(() => {
    if ((!isKuliner || isKulinerRumahan) && canOrderTier) {
      setOrderMode('pesan-dulu')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // For free tier: show claim banner + render children as-is
  if (isFree) {
    return (
      <div>
        {businessId && <ClaimBanner businessId={businessId} category={category} />}
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
      {/* Order mode selector — only for kuliner with Business tier when table is set */}
      {isKuliner && showPreOrder && state.tableNumber && (
        <OrderModeSelector accentColor={accentColor} />
      )}

      {/* Pre-order floating button — for kuliner Business tier when NO table */}
      {isKuliner && showPreOrder && !state.tableNumber && (
        state.orderMode === 'pesan-dulu' ? (
          itemCount === 0 && (
            <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold shadow-xl" style={{ backgroundColor: accentColor }}>
              <span>📦 Mode Pesan Dulu</span>
              <button
                onClick={() => setOrderMode(null)}
                className="ml-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs hover:bg-white/40"
              >
                ✕
              </button>
            </div>
          )
        ) : (
          <button
            onClick={() => setOrderMode('pesan-dulu')}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            📦 Pesan Dulu
          </button>
        )
      )}

      {/* Render template children, passing ordering state via CSS class */}
      <div
        className={hideDefaultWA ? 'ordering-active' : ''}
        style={isKuliner && showPreOrder && state.tableNumber ? { paddingTop: '52px' } : undefined}
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
        category={category}
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
