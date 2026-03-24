'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  price: string | null
  quantity: number
  imageUrl?: string | null
}

export type OrderMode = 'dine-in' | 'pre-order'

export interface CartState {
  items: CartItem[]
  orderMode: OrderMode | null
  tableNumber: string
  customerName: string
  arrivalTime: string
  proofImageUrl: string
}

type CartAction =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'SET_QUANTITY'; id: string; quantity: number }
  | { type: 'SET_ORDER_MODE'; mode: OrderMode | null }
  | { type: 'SET_TABLE'; tableNumber: string }
  | { type: 'SET_CUSTOMER_NAME'; name: string }
  | { type: 'SET_ARRIVAL_TIME'; time: string }
  | { type: 'SET_PROOF_URL'; url: string }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; state: CartState }

const initialState: CartState = {
  items: [],
  orderMode: null,
  tableNumber: '',
  customerName: '',
  arrivalTime: '',
  proofImageUrl: '',
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'SET_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }
    }
    case 'SET_ORDER_MODE':
      return { ...state, orderMode: action.mode }
    case 'SET_TABLE':
      return { ...state, tableNumber: action.tableNumber }
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.name }
    case 'SET_ARRIVAL_TIME':
      return { ...state, arrivalTime: action.time }
    case 'SET_PROOF_URL':
      return { ...state, proofImageUrl: action.url }
    case 'CLEAR_CART':
      return { ...initialState, orderMode: state.orderMode, tableNumber: state.tableNumber }
    case 'HYDRATE':
      return action.state
    default:
      return state
  }
}

interface CartContextValue {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  itemCount: number
  total: number
  totalFormatted: string
}

const CartContext = createContext<CartContextValue | null>(null)

function getStorageKey(businessId: string) {
  return `etalaso-cart-${businessId}`
}

function calculateTotal(items: CartItem[]): number {
  let total = 0
  for (const item of items) {
    if (!item.price) continue
    const num = parseInt(item.price.replace(/\D/g, ''))
    if (!isNaN(num)) total += num * item.quantity
  }
  return total
}

export function CartProvider({
  children,
  businessId,
}: {
  children: React.ReactNode
  businessId: string
}) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(getStorageKey(businessId))
      if (saved) {
        const parsed = JSON.parse(saved) as CartState
        dispatch({ type: 'HYDRATE', state: parsed })
      }
    } catch {
      // ignore parse errors
    }
  }, [businessId])

  // Persist to sessionStorage on state change
  useEffect(() => {
    try {
      sessionStorage.setItem(getStorageKey(businessId), JSON.stringify(state))
    } catch {
      // ignore storage errors
    }
  }, [state, businessId])

  const total = calculateTotal(state.items)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  const value: CartContextValue = {
    state,
    dispatch,
    itemCount,
    total,
    totalFormatted: total > 0 ? `Rp ${total.toLocaleString('id-ID')}` : 'Hubungi untuk harga',
  }

  return React.createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

// Convenience action creators
export function useCartActions() {
  const { dispatch } = useCart()

  return {
    addItem: useCallback((item: Omit<CartItem, 'quantity'>) =>
      dispatch({ type: 'ADD_ITEM', item }), [dispatch]),
    removeItem: useCallback((id: string) =>
      dispatch({ type: 'REMOVE_ITEM', id }), [dispatch]),
    setQuantity: useCallback((id: string, quantity: number) =>
      dispatch({ type: 'SET_QUANTITY', id, quantity }), [dispatch]),
    setOrderMode: useCallback((mode: OrderMode | null) =>
      dispatch({ type: 'SET_ORDER_MODE', mode }), [dispatch]),
    setTable: useCallback((tableNumber: string) =>
      dispatch({ type: 'SET_TABLE', tableNumber }), [dispatch]),
    setCustomerName: useCallback((name: string) =>
      dispatch({ type: 'SET_CUSTOMER_NAME', name }), [dispatch]),
    setArrivalTime: useCallback((time: string) =>
      dispatch({ type: 'SET_ARRIVAL_TIME', time }), [dispatch]),
    setProofUrl: useCallback((url: string) =>
      dispatch({ type: 'SET_PROOF_URL', url }), [dispatch]),
    clearCart: useCallback(() =>
      dispatch({ type: 'CLEAR_CART' }), [dispatch]),
  }
}
