import { useMemo } from 'react'
import { Link } from 'react-router'
import { useAdmin } from '@/store/adminStore'
import { formatPrice } from '@/utils/format'
import { StatCard, OrderStatusPill, Panel, TableShell, Td } from '@/components/admin/AdminUI'
import { MonthBars, Donut, HBars } from '@/components/admin/Charts'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AdminDashboardPage() {
  const { orders, customers, products } = useAdmin()

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== 'Cancelled')
    const revenue = active.reduce((sum, o) => sum + o.total, 0)
    const lowStock = products.filter((p) => p.stock <= 20).length
    const pending = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length

    const now = new Date()
    const months: Array<{ label: string; value: number; key: string }> = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ label: MONTH_LABELS[d.getMonth()], key: `${d.getFullYear()}-${d.getMonth()}`, value: 0 })
    }
    const orderCounts = new Map(months.map((m) => [m.key, 0]))
    for (const order of active) {
      const d = new Date(order.placedAt)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const bucket = months.find((m) => m.key === key)
      if (bucket) bucket.value += order.total
      orderCounts.set(key, (orderCounts.get(key) ?? 0) + 1)
    }

    const statusCounts = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => ({
      label: status,
      value: orders.filter((o) => o.status === status).length,
    }))

    const unitsByProduct = new Map<string, number>()
    for (const order of active) {
      for (const item of order.items) {
        unitsByProduct.set(item.productId, (unitsByProduct.get(item.productId) ?? 0) + item.qty)
      }
    }
    const topProducts = [...unitsByProduct.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId, units]) => {
        const product = products.find((p) => p.id === productId)
        return {
          label: product?.name ?? productId,
          value: units,
          display: `${units} units`,
        }
      })

    return {
      revenue,
      orderCount: orders.length,
      pending,
      lowStock,
      months,
      orderCounts: months.map((m) => ({ label: m.label, value: orderCounts.get(m.key) ?? 0 })),
      statusCounts,
      topProducts,
      recent: [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)).slice(0, 6),
    }
  }, [orders, products])

  return (
    <div className="space-y-8" data-testid="admin-overview">
      <div>
        <p className="eyebrow text-bronze-400">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">Good to see you.</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Revenue" value={formatPrice(stats.revenue)} hint="all active orders" />
        <StatCard label="Orders" value={stats.orderCount} hint={`${stats.pending} awaiting action`} tone="sage" />
        <StatCard label="Customers" value={customers.length} hint="lifetime accounts" />
        <StatCard label="Products" value={products.length} hint="in prototype catalog" />
        <StatCard label="Low Stock" value={stats.lowStock} hint={stats.lowStock > 0 ? 'reorder suggested' : 'all healthy'} tone={stats.lowStock > 0 ? 'clay' : 'sage'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Sales overview">
          <div className="p-6">
            <MonthBars data={stats.months} />
          </div>
        </Panel>
        <Panel title="Orders overview">
          <div className="p-6">
            <Donut segments={stats.statusCounts} centerLabel="orders" centerValue={stats.orderCount} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Product performance">
          <div className="p-6">
            {stats.topProducts.length > 0 ? (
              <HBars data={stats.topProducts} />
            ) : (
              <p className="py-8 text-center text-sm text-sage-300/50">No sales recorded yet.</p>
            )}
          </div>
        </Panel>

        <Panel
          title="Recent orders"
          actions={
            <Link to="/admin/orders" className="link-underline text-xs font-bold tracking-[0.14em] text-bronze-400 uppercase">
              View all
            </Link>
          }
        >
          <TableShell head={['Order', 'Customer', 'Status', 'Total']} minWidth={480}>
            {stats.recent.map((order) => (
              <tr key={order.id}>
                <Td><span className="font-mono text-xs font-semibold">{order.id}</span></Td>
                <Td className="max-w-36 truncate">{order.address.fullName}</Td>
                <Td><OrderStatusPill status={order.status} /></Td>
                <Td className="font-bold tabular-nums">{formatPrice(order.total)}</Td>
              </tr>
            ))}
          </TableShell>
        </Panel>
      </div>
    </div>
  )
}
