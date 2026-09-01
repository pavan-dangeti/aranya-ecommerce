import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE_ORGANIC } from '@/utils/motion'

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE_ORGANIC }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
