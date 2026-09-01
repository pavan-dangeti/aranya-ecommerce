import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { ModerationStatus } from '@/types'
import { useAdmin } from '@/store/adminStore'
import { toast } from '@/store/toastStore'
import { productById } from '@/data/products'
import { Rating } from '@/components/ui/Rating'
import { Panel } from '@/components/admin/AdminUI'
import { cn } from '@/utils/cn'

const FILTERS: Array<ModerationStatus | 'all'> = ['all', 'Pending', 'Approved', 'Rejected']

const statusTone: Record<ModerationStatus, string> = {
  Pending: 'bg-bronze-500/15 text-bronze-300',
  Approved: 'bg-moss-400/20 text-sage-200',
  Rejected: 'bg-clay-500/20 text-clay-500',
}

export default function AdminReviewsPage() {
  const { reviews, setReviewStatus } = useAdmin()
  const [filter, setFilter] = useState<ModerationStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return [...reviews]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((r) => filter === 'all' || r.status === filter)
  }, [reviews, filter])

  const pending = reviews.filter((r) => r.status === 'Pending').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-bronze-400">Community</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">Reviews</h1>
        </div>
        {pending > 0 && (
          <span className="rounded-full border border-bronze-500/40 bg-bronze-500/10 px-4 py-2 text-xs font-bold text-bronze-300">
            {pending} awaiting moderation
          </span>
        )}
      </div>

      <Panel>
        <div className="flex flex-wrap gap-1.5 border-b border-ivory-50/[0.08] px-6 py-4" role="group" aria-label="Filter by moderation status">
          {FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={cn(
                'cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all',
                filter === status
                  ? 'bg-bronze-500 text-forest-950'
                  : 'border border-ivory-50/12 text-sage-300/60 hover:border-bronze-500/40 hover:text-ivory-50'
              )}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-ivory-50/[0.05]">
          {filtered.map((review) => {
            const product = productById(review.productId)
            return (
              <li key={review.id} className="flex flex-wrap items-start justify-between gap-4 px-6 py-5" data-testid={`admin-review-${review.id}`}>
                <div className="min-w-0 max-w-xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <Rating value={review.rating} size={13} />
                    <span className={cn('rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase', statusTone[review.status])}>
                      {review.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-ivory-50">“{review.title}”</p>
                  <p className="mt-1 text-sm leading-relaxed text-sage-300/65">{review.body}</p>
                  <p className="mt-2 text-xs text-sage-300/40">
                    {review.author} · {review.location} · {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    {product && <> · on <span className="text-sage-300/60">{product.name}</span></>}
                  </p>
                </div>

                {review.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewStatus(review.id, 'Approved')
                      toast('Review approved')
                    }}
                    aria-label={`Approve review by ${review.author}`}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-moss-600/40 px-4 py-2 text-xs font-bold text-sage-200 transition-colors hover:bg-moss-600/70"
                  >
                    <Check size={13} /> Approve
                  </button>
                )}
                {review.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewStatus(review.id, 'Rejected')
                      toast('Review rejected', 'info')
                    }}
                    aria-label={`Reject review by ${review.author}`}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-clay-500/40 px-4 py-2 text-xs font-bold text-clay-500 transition-colors hover:bg-clay-500/15"
                  >
                    <X size={13} /> Reject
                  </button>
                )}
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="px-6 py-14 text-center text-sm text-sage-300/50">No reviews with this status.</li>
          )}
        </ul>
      </Panel>
    </div>
  )
}
