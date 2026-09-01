import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { CategoryId, Product } from '@/types'
import { categories, categoryName } from '@/data/categories'
import { useAdmin } from '@/store/adminStore'
import { toast } from '@/store/toastStore'
import { formatPrice } from '@/utils/format'
import { Drawer, ConfirmDialog } from '@/components/admin/Overlays'
import { Panel, TableShell, Td, EmptyRow } from '@/components/admin/AdminUI'
import { cn } from '@/utils/cn'

interface FormState {
  name: string
  category: CategoryId
  price: string
  compareAtPrice: string
  stock: string
  shortDescription: string
  origin: string
}

const EMPTY_FORM: FormState = {
  name: '',
  category: 'herbal-supplements',
  price: '',
  compareAtPrice: '',
  stock: '50',
  shortDescription: '',
  origin: '',
}

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, updateStock } = useAdmin()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [sort, setSort] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)))
    )
    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'stock': return [...list].sort((a, b) => a.stock - b.stock)
      default: return [...list].sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [products, search, category, sort])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice?.toString() ?? '',
      stock: String(product.stock),
      shortDescription: product.shortDescription,
      origin: product.origin,
    })
    setFormError(null)
    setFormOpen(true)
  }

  const submitForm = () => {
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!form.name.trim()) return setFormError('Product name is required')
    if (!Number.isFinite(price) || price <= 0) return setFormError('Enter a valid price')
    if (!Number.isFinite(stock) || stock < 0) return setFormError('Enter a valid stock count')
    if (form.compareAtPrice && Number(form.compareAtPrice) <= price) {
      return setFormError('Compare-at price must be higher than the selling price')
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock,
      shortDescription: form.shortDescription.trim() || 'A new ARANYA preparation.',
      origin: form.origin.trim() || 'India',
    }

    if (editing) {
      updateProduct(editing.id, payload)
      toast(`“${payload.name}” updated`)
    } else {
      addProduct({
        ...payload,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-product',
        description: payload.shortDescription,
        rating: 0,
        reviewCount: 0,
        ingredients: [],
        benefits: [],
        usage: '',
        tags: ['new'],
        visual: {
          form: 'flask',
          glass: '#59431f',
          liquid: '#86682f',
          label: '#f4efe3',
          accent: '#c29a64',
        },
      })
      toast(`“${payload.name}” added to the catalog`)
    }
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-bronze-400">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">Products</h1>
        </div>
        <button
          type="button"
          onClick={openAdd}
          data-testid="admin-add-product"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-bronze-500 px-6 py-3 text-xs font-bold tracking-[0.12em] text-forest-950 uppercase transition-colors hover:bg-bronze-400"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b border-ivory-50/[0.08] px-6 py-4">
          <div className="relative min-w-52 flex-1">
            <Search size={15} className="absolute top-1/2 left-4 -translate-y-1/2 text-sage-300/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or tags…"
              aria-label="Search products"
              className="h-11 w-full rounded-xl border border-ivory-50/10 bg-ivory-50/[0.04] pr-4 pl-10 text-sm text-ivory-50 outline-none placeholder:text-sage-300/35 focus:border-bronze-500/60"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryId | 'all')}
            aria-label="Filter by category"
            className="h-11 cursor-pointer appearance-none rounded-xl border border-ivory-50/10 bg-ivory-50/[0.04] px-4 text-sm font-semibold text-sage-200/85 outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort products"
            className="h-11 cursor-pointer appearance-none rounded-xl border border-ivory-50/10 bg-ivory-50/[0.04] px-4 text-sm font-semibold text-sage-200/85 outline-none"
          >
            <option value="name">Sort: Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Stock: Low to High</option>
          </select>
        </div>

        <TableShell head={['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions']} minWidth={760}>
          {filtered.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-ivory-50/[0.02]">
              <Td>
                <p className="font-semibold text-ivory-50">{product.name}</p>
                <p className="mt-0.5 max-w-64 truncate text-xs text-sage-300/45">{product.shortDescription}</p>
              </Td>
              <Td className="text-sage-300/60">{categoryName(product.category)}</Td>
              <Td className="tabular-nums">
                {formatPrice(product.price)}
                {product.compareAtPrice && (
                  <span className="ml-2 text-xs text-sage-300/35 line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </Td>
              <Td>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`Decrease stock of ${product.name}`}
                    onClick={() => updateStock(product.id, Math.max(0, product.stock - 5))}
                    className="size-7 cursor-pointer rounded-lg border border-ivory-50/12 text-xs font-bold text-sage-200/70 transition-colors hover:border-bronze-500/50"
                  >–</button>
                  <span className={cn('w-10 text-center font-bold tabular-nums', product.stock <= 5 ? 'text-clay-500' : product.stock <= 20 ? 'text-bronze-400' : 'text-ivory-50')}>
                    {product.stock}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase stock of ${product.name}`}
                    onClick={() => updateStock(product.id, product.stock + 5)}
                    className="size-7 cursor-pointer rounded-lg border border-ivory-50/12 text-xs font-bold text-sage-200/70 transition-colors hover:border-bronze-500/50"
                  >+</button>
                </div>
              </Td>
              <Td>{product.rating > 0 ? `★ ${product.rating}` : '—'}</Td>
              <Td>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    aria-label={`Edit ${product.name}`}
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-ivory-50/12 text-sage-200/70 transition-colors hover:border-bronze-500/60 hover:text-bronze-400"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(product)}
                    aria-label={`Delete ${product.name}`}
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-ivory-50/12 text-sage-200/70 transition-colors hover:border-clay-500/60 hover:text-clay-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {filtered.length === 0 && <EmptyRow colSpan={6} message="No products match this search." />}
        </TableShell>
      </Panel>

      <Drawer open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit product' : 'Add product'}>
        <div className="space-y-4">
          <AdminField label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={adminInput} />
          </AdminField>
          <div className="grid grid-cols-2 gap-4">
            <AdminField label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CategoryId })} className={cn(adminInput, 'cursor-pointer appearance-none')}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Stock">
              <input inputMode="numeric" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value.replace(/[^\d]/g, '') })} className={adminInput} />
            </AdminField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminField label="Price (₹)">
              <input inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^\d]/g, '') })} className={adminInput} />
            </AdminField>
            <AdminField label="Compare-at price (₹, optional)">
              <input inputMode="numeric" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value.replace(/[^\d]/g, '') })} className={adminInput} />
            </AdminField>
          </div>
          <AdminField label="Short description">
            <textarea rows={3} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={cn(adminInput, 'h-auto resize-none py-3')} />
          </AdminField>
          <AdminField label="Origin">
            <input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className={adminInput} />
          </AdminField>

          {formError && <p role="alert" className="rounded-xl border border-clay-500/30 bg-clay-500/10 px-4 py-3 text-xs font-semibold text-clay-500">{formError}</p>}

          <button
            type="button"
            onClick={submitForm}
            className="w-full cursor-pointer rounded-full bg-bronze-500 py-4 text-xs font-bold tracking-[0.14em] text-forest-950 uppercase transition-colors hover:bg-bronze-400"
          >
            {editing ? 'Save changes' : 'Add product'}
          </button>
          <p className="text-center text-[11px] text-sage-300/40">
            Prototype scope — catalog changes live in the admin demo store.
          </p>
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            deleteProduct(deleting.id)
            toast(`“${deleting.name}” removed from the catalog`, 'info')
          }
        }}
        title="Delete product?"
        body={`“${deleting?.name}” will be removed from the prototype catalog. This cannot be undone.`}
      />
    </div>
  )
}

export const adminInput =
  'h-12 w-full rounded-xl border border-ivory-50/10 bg-ivory-50/[0.04] px-4 text-sm text-ivory-50 outline-none transition-colors placeholder:text-sage-300/35 focus:border-bronze-500/60'

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold tracking-[0.16em] text-sage-300/55 uppercase">{label}</span>
      {children}
    </label>
  )
}
