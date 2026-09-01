import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import type { Testimonial } from '@/types'
import { testimonials } from '@/data/testimonials'
import { Rating } from '@/components/ui/Rating'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fadeUp, viewportOnce } from '@/utils/motion'

export function TestimonialsSection() {
  return (
    <section className="bg-forest-950 py-28 lg:py-36" aria-labelledby="testimonials-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="Kind Words"
          title={
            <>
              From Our <em className="font-light text-bronze-300 italic">Community</em>
            </>
          }
          description="A few notes from the people who keep our rituals alive. Names and stories are illustrative for this concept store."
          tone="light"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {(testimonials as Testimonial[]).map((t) => (
            <motion.figure
              key={t.id}
              variants={fadeUp}
              className="flex h-full flex-col rounded-3xl border border-ivory-50/[0.08] bg-forest-900/70 p-8 transition-colors duration-500 hover:border-bronze-500/30"
              data-testid={`testimonial-${t.id}`}
            >
              <Quote size={22} className="text-bronze-400/60" aria-hidden="true" />
              <blockquote className="mt-4 flex-1">
                <p className="font-display text-[17px] leading-relaxed font-light text-sage-200/90 italic">
                  “{t.quote}”
                </p>
              </blockquote>
              <figcaption className="mt-6 border-t border-ivory-50/[0.08] pt-5">
                <Rating value={t.rating} size={13} tone="light" />
                <p className="mt-2 text-sm font-semibold text-ivory-50">{t.name}</p>
                <p className="text-xs text-sage-300/50">{t.city}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        <p id="testimonials-heading" className="sr-only">Customer testimonials</p>
      </div>
    </section>
  )
}
