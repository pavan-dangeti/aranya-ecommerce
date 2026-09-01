import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { products } from '@/data/products'
import { useWishlist } from '@/store/wishlistStore'
import { ProductCard } from '@/components/products/ProductCard'
import { PageShell } from './PageShell'
import { ButtonLink } from '@/components/ui/Button'
import { fadeUp } from '@/utils/motion'
import { useDocumentMeta } from '@/hooks'

export default function WishlistPage() {
  useDocumentMeta('Wishlist — ARANYA')
  const ids = useWishlist((s) => s.ids)
  const saved = products.filter((p) => ids.includes(p.id))

  return (
    <PageShell className="bg-ivory-50">
      <header className="border-b hairline bg-gradient-to-b from-ivory-100 to-ivory-50 pt-36 pb-12">
        <div className="shell">
          <p className="eyebrow text-bronze-600">Saved for later</p>
          <h1 className="mt-2 font-display text-5xl font-medium tracking-tight">Wishlist</h1>
        </div>
      </header>

      <div className="shell py-14 pb-28">
        {saved.length === 0 ? (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mx-auto max-w-md py-16 text-center">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-clay-500/[0.07] text-clay-500">
              <Heart size={30} strokeWidth={1.4} />
            </span>
            <h2 className="mt-8 font-display text-3xl font-medium">Nothing saved yet</h2>
            <p className="mt-4 leading-relaxed text-forest-900/55">
              Tap the heart on any product to keep it here while you wander.
            </p>
            <ButtonLink to="/products" className="mt-8" variant="primary" magnetic>
              Wander the shop
            </ButtonLink>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
