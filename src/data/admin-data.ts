import type { AdminCustomer, AdminReview, Order, OrderStatus, PaymentMethod } from '@/types'
import { products } from '@/data/products'


export const adminCustomers: AdminCustomer[] = [
  { id: 'cus-01', name: 'Ishita Roy', email: 'ishita.roy@example.com', city: 'Bengaluru', orders: 8, spent: 11240, status: 'VIP', memberSince: '2025-06-15' },
  { id: 'cus-02', name: 'Karthik Subramanian', email: 'k.subramanian@example.com', city: 'Chennai', orders: 6, spent: 5130, status: 'Active', memberSince: '2025-08-02' },
  { id: 'cus-03', name: 'Nandini Pillai', email: 'nandini.p@example.com', city: 'Mumbai', orders: 7, spent: 6975, status: 'Active', memberSince: '2025-07-19' },
  { id: 'cus-04', name: 'Arjun Bedi', email: 'arjun.bedi@example.com', city: 'Gurugram', orders: 4, spent: 3297, status: 'Active', memberSince: '2025-09-30' },
  { id: 'cus-05', name: 'Shreya Mohan', email: 'shreya.m@example.com', city: 'Coimbatore', orders: 3, spent: 1908, status: 'Dormant', memberSince: '2025-10-11' },
  { id: 'cus-06', name: 'Rhea Fernandes', email: 'rhea.f@example.com', city: 'Panaji', orders: 6, spent: 7460, status: 'VIP', memberSince: '2025-05-28' },
  { id: 'cus-07', name: 'Devika Sharma', email: 'devika.s@example.com', city: 'Jaipur', orders: 5, spent: 3860, status: 'Active', memberSince: '2025-11-09' },
  { id: 'cus-08', name: 'Farhan Qureshi', email: 'farhan.q@example.com', city: 'Hyderabad', orders: 2, spent: 1198, status: 'Dormant', memberSince: '2026-01-22' },
  { id: 'cus-09', name: 'Meera Kulkarni', email: 'meera.k@example.com', city: 'Pune', orders: 9, spent: 9875, status: 'VIP', memberSince: '2025-04-03' },
  { id: 'cus-10', name: 'Rohan Iyer', email: 'rohan.iyer@example.com', city: 'Chennai', orders: 3, spent: 1642, status: 'Active', memberSince: '2026-02-14' },
  { id: 'cus-11', name: 'Tanvi Deshpande', email: 'tanvi.d@example.com', city: 'Mumbai', orders: 4, spent: 4180, status: 'Active', memberSince: '2025-12-05' },
  { id: 'cus-12', name: 'Nikhil Verma', email: 'nikhil.v@example.com', city: 'Gurugram', orders: 1, spent: 429, status: 'Dormant', memberSince: '2026-03-30' },
]

const customerAddress = (i: number) => {
  const c = adminCustomers[i % adminCustomers.length]
  return {
    fullName: c.name,
    email: c.email,
    phone: `98${String(10000000 + i * 1234567).slice(0, 8)}`,
    addressLine: `${12 + i} Grove Street, ${c.city}`,
    city: c.city,
    state: ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Haryana', 'Goa', 'Rajasthan'][i % 6],
    postalCode: `5600${String(10 + (i % 40)).padStart(2, '0')}`,
    country: 'India',
  }
}

interface Spec {
  customer: number
  items: Array<[string, number]>
  status: OrderStatus
  daysAgo: number
  payment: PaymentMethod
}

const SPECS: Spec[] = [
  { customer: 0, items: [['arn-012', 1], ['arn-003', 2]], status: 'Shipped', daysAgo: 3, payment: 'upi' },
  { customer: 2, items: [['arn-008', 2]], status: 'Processing', daysAgo: 1, payment: 'card' },
  { customer: 10, items: [['arn-011', 3]], status: 'Pending', daysAgo: 0, payment: 'upi' },
  { customer: 3, items: [['arn-001', 1], ['arn-002', 1]], status: 'Pending', daysAgo: 0, payment: 'cod' },
  { customer: 4, items: [['arn-006', 1]], status: 'Delivered', daysAgo: 21, payment: 'card' },
  { customer: 5, items: [['arn-012', 1], ['arn-007', 1]], status: 'Delivered', daysAgo: 34, payment: 'card' },
  { customer: 8, items: [['arn-001', 2], ['arn-013', 1]], status: 'Delivered', daysAgo: 47, payment: 'upi' },
  { customer: 1, items: [['arn-003', 1], ['arn-011', 1]], status: 'Delivered', daysAgo: 52, payment: 'upi' },
  { customer: 6, items: [['arn-008', 1], ['arn-009', 1]], status: 'Cancelled', daysAgo: 9, payment: 'cod' },
  { customer: 9, items: [['arn-004', 1]], status: 'Delivered', daysAgo: 66, payment: 'upi' },
  { customer: 11, items: [['arn-011', 1]], status: 'Delivered', daysAgo: 71, payment: 'card' },
  { customer: 0, items: [['arn-007', 1], ['arn-010', 1]], status: 'Delivered', daysAgo: 84, payment: 'card' },
  { customer: 2, items: [['arn-014', 2]], status: 'Delivered', daysAgo: 92, payment: 'upi' },
  { customer: 5, items: [['arn-012', 1]], status: 'Cancelled', daysAgo: 96, payment: 'card' },
  { customer: 8, items: [['arn-002', 2], ['arn-013', 1]], status: 'Delivered', daysAgo: 103, payment: 'upi' },
  { customer: 3, items: [['arn-005', 1]], status: 'Delivered', daysAgo: 118, payment: 'card' },
  { customer: 6, items: [['arn-010', 1], ['arn-014', 1]], status: 'Delivered', daysAgo: 126, payment: 'upi' },
  { customer: 1, items: [['arn-008', 2]], status: 'Delivered', daysAgo: 139, payment: 'card' },
  { customer: 9, items: [['arn-011', 2], ['arn-003', 1]], status: 'Delivered', daysAgo: 147, payment: 'upi' },
  { customer: 10, items: [['arn-006', 1], ['arn-012', 1]], status: 'Delivered', daysAgo: 161, payment: 'card' },
  { customer: 4, items: [['arn-001', 1]], status: 'Cancelled', daysAgo: 168, payment: 'cod' },
  { customer: 0, items: [['arn-003', 3]], status: 'Delivered', daysAgo: 180, payment: 'upi' },
]

const CODES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const orderId = (i: number) => {
  let suffix = ''
  for (let n = 0; n < 6; n++) suffix += CODES[(i * 7 + n * 13 + 11) % CODES.length]
  return `ARN-${suffix}`
}

export const adminOrders: Order[] = SPECS.map((spec, i) => {
  const items = spec.items.flatMap(([productId, qty]) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return []
    return [{ productId, name: product.name, qty, price: product.price }]
  })
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal >= 999 ? 0 : 79
  const placed = new Date()
  placed.setDate(placed.getDate() - spec.daysAgo)
  const eta = new Date(placed)
  eta.setDate(eta.getDate() + 5)
  return {
    id: orderId(i + 20),
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    address: customerAddress(spec.customer),
    paymentMethod: spec.payment,
    status: spec.status,
    placedAt: placed.toISOString(),
    estimatedDelivery: eta.toISOString(),
  }
})

export const adminReviews: AdminReview[] = [
  { id: 'rev-001', productId: 'arn-001', author: 'Meera Kulkarni', location: 'Pune', rating: 5, date: '2026-06-14', title: 'Part of my evenings now', body: 'Smells genuinely of the root, not stale powder. Two capsules with warm milk before bed have become something I look forward to.', status: 'Approved' },
  { id: 'rev-002', productId: 'arn-001', author: 'Aditya Rao', location: 'Bengaluru', rating: 4, date: '2026-05-28', title: 'Clean and simple', body: 'No fillers, honest powder. Capsules are slightly larger than expected but that is whole-root for you.', status: 'Approved' },
  { id: 'rev-003', productId: 'arn-003', author: 'Sanya Bhatt', location: 'Delhi', rating: 5, date: '2026-07-02', title: 'The real tulsi taste', body: 'Takes me right back to our courtyard plant. A few drops in hot water and the whole kitchen smells like monsoon.', status: 'Approved' },
  { id: 'rev-004', productId: 'arn-003', author: 'Rohan Iyer', location: 'Chennai', rating: 5, date: '2026-06-19', title: 'Excellent quality', body: 'Drops into sparkling water with lime is my afternoon ritual now. Deeper than single-variety tulsi.', status: 'Approved' },
  { id: 'rev-005', productId: 'arn-002', author: 'Kavitha Menon', location: 'Hyderabad', rating: 5, date: '2026-04-30', title: 'Golden milk sorted', body: 'One tablet dissolves into the most gorgeous golden milk. Subtle pepper warmth at the end.', status: 'Approved' },
  { id: 'rev-006', productId: 'arn-008', author: 'Priya Nambiar', location: 'Kochi', rating: 5, date: '2026-07-11', title: 'Like my grandmother’s', body: 'The smell when I warm it between my palms is exactly her Sunday champi.', status: 'Approved' },
  { id: 'rev-007', productId: 'arn-008', author: 'Devika Sharma', location: 'Jaipur', rating: 4, date: '2026-05-05', title: 'Great, wish it came bigger', body: 'Washes out easily which matters with long hair. Please make a larger size!', status: 'Approved' },
  { id: 'rev-008', productId: 'arn-012', author: 'Ananya Ghosh', location: 'Kolkata', rating: 5, date: '2026-06-25', title: 'Worth every rupee', body: 'Three drops at night, skin feels cared for by morning. The saffron aroma alone is worth it.', status: 'Approved' },
  { id: 'rev-009', productId: 'arn-012', author: 'Tanvi Deshpande', location: 'Mumbai', rating: 5, date: '2026-07-18', title: 'A ritual, truly', body: 'The three-night rhythm made it feel like ceremony rather than another step.', status: 'Approved' },
  { id: 'rev-013', productId: 'arn-014', author: 'Zoya Khan', location: 'Lucknow', rating: 5, date: '2026-07-28', title: 'Dessert in a cup', body: 'Cocoa husk and cardamom is a genius pairing. My after-dinner coffee has officially retired.', status: 'Pending' },
  { id: 'rev-014', productId: 'arn-005', author: 'Gaurav Shetty', location: 'Mangaluru', rating: 3, date: '2026-07-29', title: 'Fine but mild', body: 'I expected a stronger flavour. Capsules are convenient though.', status: 'Pending' },
  { id: 'rev-015', productId: 'arn-010', author: 'Anonymous Guest', location: '—', rating: 2, date: '2026-07-30', title: 'Spam listing', body: 'Check out my page for cheap supplements!!!', status: 'Rejected' },
]
