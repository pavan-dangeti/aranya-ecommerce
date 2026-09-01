import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Suspense } from 'react'
import { useWebGLAvailable } from '@/hooks'
import { SceneLoader } from '@/components/ui/loaders'

interface Scene3DProps {
  children: (active: boolean) => ReactNode
  fallback: ReactNode
  className?: string
  label?: string
  rootMargin?: string
}

/**
 * Gates a R3F canvas behind: WebGL support, viewport proximity (lazy chunk +
 * mount), and tab visibility. Renders `fallback` whenever any gate fails.
 */
export function Scene3D({
  children,
  fallback,
  className,
  label = '3D scene',
  rootMargin = '400px',
}: Scene3DProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const webgl = useWebGLAvailable()
  const [nearView, setNearView] = useState(false)
  const [inView, setInView] = useState(false)
  const [visibleTab, setVisibleTab] = useState(true)

  useEffect(() => {
    const host = hostRef.current
    if (!host || webgl === false) return

    const lazyObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true)
          lazyObserver.disconnect()
        }
      },
      { rootMargin }
    )
    const activeObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    lazyObserver.observe(host)
    activeObserver.observe(host)

    const onVisibility = () => setVisibleTab(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      lazyObserver.disconnect()
      activeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [webgl, rootMargin])

  const active = nearView && inView && visibleTab

  return (
    <div ref={hostRef} className={className} aria-hidden="true">
      {webgl === null && <SceneLoader label={label} />}
      {webgl === true &&
        (nearView ? (
          <Suspense fallback={<SceneLoader label={label} />}>{children(active)}</Suspense>
        ) : (
          <SceneLoader label={label} />
        ))}
      {webgl === false && fallback}
    </div>
  )
}
