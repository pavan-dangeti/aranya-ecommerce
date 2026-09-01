import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'
import { productById } from '@/data/products'

interface CartState {
  items: CartItem[]
  add: (productId: string, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (productId, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId ? { ...i, qty: Math.min(i.qty + qty, 10) } : i
              ),
            }
          }
          return { items: [...state.items, { productId, qty }] }
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, qty: Math.min(qty, 10) } : i
                ),
        })),
      increment: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, qty: Math.min(i.qty + 1, 10) } : i
          ),
        })),
      decrement: (productId) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'aranya-cart-v1' }
  )
)

export interface DetailedCartItem extends CartItem {
  name: string
  slug: string
  price: number
  stock: number
}

export function detailedCart(items: CartItem[]): {
  lines: DetailedCartItem[]
  subtotal: number
} {
  const lines: DetailedCartItem[] = []
  for (const item of items) {
    const product = productById(item.productId)
    if (!product) continue
    lines.push({
      ...item,
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
    })
  }
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  return { lines, subtotal }
}

export const cartCount = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.qty, 0)
