import type {
  Order,
  OrderAddress,
  CartItem,
  PagedProducts,
  Product,
  ProductQuery,
  Review,
  User,
} from '@/types'
import { products } from '@/data/products'
import { reviews as seedReviews } from '@/data/reviews'
import { adminOrders } from '@/data/admin-data'
import { demoAccounts } from '@/data/demo-accounts'
import { sleep, readStorage, writeStorage, randomId, clamp } from '@/utils/misc'


const ORDERS_KEY = 'aranya-orders-v1'
const REVIEWS_KEY = 'aranya-user-reviews-v1'

const LATENCY = Number(import.meta.env.VITE_MOCK_LATENCY ?? 280)

function localOrders(): Order[] {
  return readStorage<Order[]>(ORDERS_KEY) ?? []
}

function localReviews(): Review[] {
  return readStorage<Review[]>(REVIEWS_KEY) ?? []
}

export const productService = {
  async query(params: ProductQuery): Promise<PagedProducts> {
    await sleep(LATENCY)
    const q = params.search?.trim().toLowerCase()
    let list = [...products]

    if (q) {
      list = list.filter((p) => {
        const haystack = [
          p.name,
          p.shortDescription,
          p.origin,
          ...p.tags,
          ...p.ingredients.map((i) => i.name),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }
    if (params.categories?.length) {
      list = list.filter((p) => params.categories!.includes(p.category))
    }
    if (params.minPrice != null) list = list.filter((p) => p.price >= params.minPrice!)
    if (params.maxPrice != null) list = list.filter((p) => p.price <= params.maxPrice!)
    if (params.minRating != null) list = list.filter((p) => p.rating >= params.minRating!)

    switch (params.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        list.sort(
          (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew))
        )
        break
      default:
        list.sort(
          (a, b) =>
            Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
            b.rating - a.rating
        )
    }

    const pageSize = clamp(params.pageSize ?? 9, 1, 48)
    const total = list.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const page = clamp(params.page ?? 1, 1, totalPages)

    return {
      items: list.slice((page - 1) * pageSize, page * pageSize),
      total,
      page,
      pageSize,
      totalPages,
    }
  },

  async bySlug(slug: string): Promise<Product | undefined> {
    await sleep(LATENCY / 2)
    return products.find((p) => p.slug === slug)
  },

  async featured(): Promise<Product[]> {
    await sleep(LATENCY)
    const featured = products.filter((p) => p.featured)
    return featured.length > 0 ? featured : products.slice(0, 6)
  },

  async related(slug: string, limit = 4): Promise<Product[]> {
    await sleep(LATENCY / 2)
    const current = products.find((p) => p.slug === slug)
    if (!current) return []
    return products
      .filter((p) => p.id !== current.id)
      .sort((a, b) => {
        const scoreA = a.category === current.category ? 1 : 0
        const scoreB = b.category === current.category ? 1 : 0
        return scoreB - scoreA || b.rating - a.rating
      })
      .slice(0, limit)
  },
}

export const reviewService = {
  async byProduct(productId: string): Promise<Review[]> {
    await sleep(LATENCY / 2)
    const userReviews = localReviews().filter((r) => r.productId === productId)
    return [...userReviews, ...seedReviews.filter((r) => r.productId === productId)]
  },

  async add(input: Omit<Review, 'id' | 'date'>): Promise<Review> {
    await sleep(LATENCY / 2)
    const review: Review = { ...input, id: randomId('rev'), date: new Date().toISOString() }
    writeStorage(REVIEWS_KEY, [review, ...localReviews()])
    return review
  },
}

export interface PlaceOrderInput {
  items: CartItem[]
  address: OrderAddress
  paymentMethod: Order['paymentMethod']
}

export const orderService = {
  FREE_SHIPPING_THRESHOLD: 999,
  SHIPPING_FEE: 79,

  shippingFor(subtotal: number): number {
    if (subtotal <= 0 || subtotal >= this.FREE_SHIPPING_THRESHOLD) return 0
    return this.SHIPPING_FEE
  },

  async place({ items, address, paymentMethod }: PlaceOrderInput): Promise<Order> {
    await sleep(900)
    const resolved = items.flatMap((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return []
      return [{ productId: product.id, name: product.name, qty: item.qty, price: product.price }]
    })
    if (resolved.length === 0) throw new Error('Cart is empty')

    const subtotal = resolved.reduce((sum, i) => sum + i.price * i.qty, 0)
    const shipping = orderService.shippingFor(subtotal)
    const eta = new Date()
    eta.setDate(eta.getDate() + 5)

    const order: Order = {
      id: randomId('ARN'),
      items: resolved,
      subtotal,
      shipping,
      total: subtotal + shipping,
      address,
      paymentMethod,
      status: 'Processing',
      placedAt: new Date().toISOString(),
      estimatedDelivery: eta.toISOString(),
    }

    writeStorage(ORDERS_KEY, [order, ...localOrders()])
    return order
  },

  async byUser(email: string): Promise<Order[]> {
    await sleep(LATENCY / 2)
    const mine = localOrders().filter((o) => o.address.email === email)
    return [...mine, ...adminOrders]
  },

  async byId(id: string): Promise<Order | undefined> {
    await sleep(LATENCY / 2)
    if (id === adminOrders[0]?.id) return adminOrders[0]
    return localOrders().find((o) => o.id === id)
  },
}

const sessionAccounts = new Map<string, { user: User; password: string }>()

export const authService = {
  async register(name: string, email: string, password: string, phone?: string): Promise<User> {
    await sleep(LATENCY / 2)
    const key = email.trim().toLowerCase()
    if (sessionAccounts.has(key) || demoAccounts.some((d) => d.email === key)) {
      throw new Error('An account with this email already exists in this session')
    }
    const user: User = {
      id: randomId('usr'),
      name: name.trim(),
      email: key,
      phone: phone?.trim() || undefined,
      role: 'customer',
      memberSince: new Date().toISOString(),
    }
    sessionAccounts.set(key, { user, password })
    return user
  },

  async login(email: string, password: string): Promise<User> {
    await sleep(LATENCY)
    const key = email.trim().toLowerCase()
    const session = sessionAccounts.get(key)
    if (session) {
      if (session.password !== password) throw new Error('Invalid email or password')
      return session.user
    }
    const demo = demoAccounts.find((d) => d.email === key)
    if (!demo || demo.password !== password) throw new Error('Invalid email or password')
    const { password: _pw, ...user } = demo
    return user
  },
}
