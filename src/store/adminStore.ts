import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminCustomer, AdminReview, Order, OrderStatus, Product } from '@/types'
import { products as catalog } from '@/data/products'
import { adminCustomers, adminOrders, adminReviews } from '@/data/admin-data'
import { readStorage } from '@/utils/misc'


const localOrders = (): Order[] => readStorage<Order[]>('aranya-orders-v1') ?? []

const seedOrders = (): Order[] => [...localOrders(), ...adminOrders]

interface AdminState {
  products: Product[]
  orders: Order[]
  customers: AdminCustomer[]
  reviews: AdminReview[]
  addProduct: (input: Omit<Product, 'id'>) => Product
  updateProduct: (id: string, input: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateStock: (id: string, stock: number) => void
  setOrderStatus: (id: string, status: OrderStatus) => void
  setReviewStatus: (id: string, status: AdminReview['status']) => void
}

const categoryPalette: Record<string, Product['visual']> = {
  'herbal-supplements': { form: 'flask', glass: '#59431f', liquid: '#86682f', label: '#f4efe3', accent: '#c29a64' },
  'skin-care': { form: 'jar', glass: '#b98d84', liquid: '#e8cfc7', label: '#faf7f0', accent: '#c29a64' },
  'hair-care': { form: 'pump', glass: '#4a3d22', liquid: '#7d6531', label: '#f4efe3', accent: '#dcc091' },
  wellness: { form: 'jar', glass: '#6b7a4a', liquid: '#93a45e', label: '#f4efe3', accent: '#5d8266' },
  'herbal-drinks': { form: 'tin', glass: '#2c4a7c', liquid: '#41649e', label: '#f4efe3', accent: '#a9824e' },
  'personal-care': { form: 'pump', glass: '#3f4a41', liquid: '#6d7d68', label: '#f4efe3', accent: '#8aa48c' },
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      products: catalog.map((p) => ({ ...p })),
      orders: seedOrders(),
      customers: adminCustomers,
      reviews: adminReviews,

      addProduct: (input) => {
        const product: Product = {
          ...input,
          id: `arn-new-${Math.random().toString(36).slice(2, 8)}`,
          rating: 0,
          reviewCount: 0,
          visual: categoryPalette[input.category] ?? categoryPalette['herbal-supplements'],
          isNew: true,
        }
        set((state) => ({ products: [product, ...state.products] }))
        return product
      },

      updateProduct: (id, input) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...input } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      updateStock: (id, stock) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock } : p)),
        })),

      setOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      setReviewStatus: (id, status) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
    }),
    { name: 'aranya-admin-v1' }
  )
)
