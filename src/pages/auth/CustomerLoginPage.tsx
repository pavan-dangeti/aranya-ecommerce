import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { authService } from '@/services/api'
import { useAuth } from '@/store/authStore'
import { validEmail } from '@/utils/validate'
import { AuthLayout, inputStyles } from './AuthLayout'
import { Button } from '@/components/ui/Button'

export default function CustomerLoginPage() {
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [remember, setRemember] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const el = formRef.current
    if (!el) return
    const guard = (e: SubmitEvent) => e.preventDefault()
    el.addEventListener('submit', guard)
    return () => el.removeEventListener('submit', guard)
  }, [])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')
    const emailError = validEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const user = await authService.login(email, password)
      if (user.role !== 'customer') {
        setError('This account is an administrator. Use the admin sign-in instead.')
        return
      }
      login(user, { remember })
      navigate(from !== '/' ? from : '/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Customer sign in"
      title="Welcome back"
      subtitle="Sign in to reach your orders, wishlist and saved rituals."
      footer={
        <>
          New to Aranya?{' '}
          <Link to="/register/customer" className="link-underline font-semibold text-bronze-400" data-testid="link-register">
            Create an account
          </Link>
        </>
      }
    >
      <form ref={formRef} onSubmit={submit} noValidate className="mt-7 space-y-4" data-testid="customer-login-form">
        <div>
          <label htmlFor="cust-email" className="mb-1.5 block text-xs font-bold tracking-[0.12em] text-sage-300/70 uppercase">
            Email
          </label>
          <input
            id="cust-email"
            name="email"
            type="email"
            autoComplete="email"
            data-testid="customer-email"
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="cust-password" className="mb-1.5 block text-xs font-bold tracking-[0.12em] text-sage-300/70 uppercase">
            Password
          </label>
          <input
            id="cust-password"
            name="password"
            type="password"
            autoComplete="current-password"
            data-testid="customer-password"
            className={inputStyles}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-sage-300/70">
            <input
              type="checkbox"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 cursor-pointer appearance-none rounded-[5px] border border-ivory-50/25 transition-colors checked:border-bronze-400 checked:bg-bronze-500 checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20stroke%3D%22%23070f0b%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22M3%208.5l3.5%203.5L13%205%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="link-underline text-xs font-semibold text-sage-300/60">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-clay-500/30 bg-clay-500/10 px-4 py-3 text-xs font-semibold text-clay-500" data-testid="login-error">
            {error}
          </p>
        )}

        <Button type="submit" variant="bronze" size="lg" magnetic className="w-full" disabled={busy} data-testid="customer-login-submit">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <Link
        to="/products"
        className="mt-6 block rounded-xl border border-ivory-50/[0.08] py-3.5 text-center text-xs font-bold tracking-[0.14em] text-sage-300/70 uppercase transition-colors hover:border-ivory-50/25 hover:text-ivory-50"
        data-testid="continue-as-guest"
      >
        Continue as guest
      </Link>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-sage-300/45">
        Demo prototype — accounts created here live only in this browser session.
      </p>
    </AuthLayout>
  )
}
