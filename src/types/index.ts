export type CategoryId =
  | 'herbal-supplements'
  | 'skin-care'
  | 'hair-care'
  | 'wellness'
  | 'herbal-drinks'
  | 'personal-care'

export interface Category {
  id: CategoryId
  name: string
  tagline: string
}

export interface ProductIngredient {
  name: string
  note: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: CategoryId
  description: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  rating: number
  reviewCount: number
  ingredients: ProductIngredient[]
  benefits: string[]
  usage: string
  origin: string
  stock: number
  tags: string[]
  featured?: boolean
  isNew?: boolean
  visual: {
    form: BottleForm
    glass: string
    liquid: string
    label: string
    accent: string
  }
}

export type BottleForm = 'dropper' | 'jar' | 'pump' | 'flask' | 'tin' | 'tube'

export interface Review {
  id: string
  productId: string
  author: string
  location: string
  rating: number
  date: string
  title: string
  body: string
}

export interface Testimonial {
  id: string
  name: string
  city: string
  rating: number
  quote: string
}

export interface Ingredient {
  id: string
  name: string
  sanskritName: string
  latinName: string
  origin: string
  traditionalCategory: string
  description: string
  foundIn: string[]
  palette: { deep: string; soft: string; accent: string }
}

export interface ArticleSection {
  heading?: string
  paragraphs: string[]
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  readTime: string
  topic: string
  date: string
  pullQuote: string
  sections: ArticleSection[]
}

export interface CartItem {
  productId: string
  qty: number
}

export interface OrderAddress {
  fullName: string
  email: string
  phone: string
  addressLine: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type PaymentMethod = 'upi' | 'card' | 'cod'

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

export interface OrderItem {
  productId: string
  name: string
  qty: number
  price: number
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  address: OrderAddress
  paymentMethod: PaymentMethod
  status: OrderStatus
  placedAt: string
  estimatedDelivery: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  memberSince: string
}

export interface Address {
  id: string
  label: string
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
  postalCode: string
  isDefault: boolean
}

export type CustomerStatus = 'Active' | 'VIP' | 'Dormant'

export interface AdminCustomer {
  id: string
  name: string
  email: string
  city: string
  orders: number
  spent: number
  status: CustomerStatus
  memberSince: string
}

export type ModerationStatus = 'Pending' | 'Approved' | 'Rejected'

export interface AdminReview {
  id: string
  productId: string
  author: string
  location: string
  rating: number
  date: string
  title: string
  body: string
  status: ModerationStatus
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'

export interface ProductQuery {
  search?: string
  categories?: CategoryId[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sort?: SortOption
  page?: number
  pageSize?: number
}

export interface PagedProducts {
  items: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
