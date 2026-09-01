import type { User } from '@/types'
export const demoAccounts: Array<User & { password: string }> = [
  {
    id: 'usr-admin-demo',
    name: 'Aranya Admin',
    email: 'admin@aranya.demo',
    role: 'admin',
    memberSince: '2025-06-15',
    password: 'aranya-admin-2026',
  },
  {
    id: 'usr-customer-demo',
    name: 'Demo Explorer',
    email: 'customer@aranya.demo',
    role: 'customer',
    memberSince: '2025-11-02',
    password: 'aranya-customer-2026',
  },
]
