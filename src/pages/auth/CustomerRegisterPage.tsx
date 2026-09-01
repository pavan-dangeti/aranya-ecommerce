import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { authService } from '@/services/api'
import { useAuth } from '@/store/authStore'
import { minLength, validEmail, validPhoneIN } from '@/utils/validate'
import { AuthLayout, inputStyles } from './AuthLayout'
import { Button } from '@/components/ui/Button'

export default function CustomerRegisterPage() {
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const form = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      password: String(fd.get('password') ?? ''),
      confirm: String(fd.get('confirm') ?? ''),
    }

    const next: Record<string, string> = {}
    const nameErr = minLength(form.name, 2, 'Full name')
    if (nameErr) next.name = nameErr
    const emailError = validEmail(form.email)
    if (emailError) next.email = emailError
    const phoneError = validPhoneIN(form.phone)
    if (phoneError) next.phone = phoneError
    if (form.password.length < 8) next.password = 'Use at least 8 characters'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setBusy(true)
    try {
      const user = await authService.register(form.name, form.email, form.password, form.phone)
      login(user, { remember: true })
      navigate('/profile')
    } catch (err) {
      setErrors({ email: err instanceof Error ? err.message : 'Registration failed' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Customer registration"
      title="Create your account"
      subtitle="Order history, saved addresses, wishlist and first access to small batches."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login/customer" className="link-underline font-semibold text-bronze-400" data-testid="link-login">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="mt-7 space-y-4" data-testid="customer-register-form">
        <div>
          <label htmlFor="reg-name" className="mb-1.5 block text-xs font-bold tracking-[0.12em] text-sage-300/70 uppercase">
            Full name
          </label>
          <input id="reg-name" name="name" autoComplete="name" data-testid="reg-name" className={inputStyles} />
        </div>
        {errors.name && <p role="alert" className="text-xs font-semibold text-clay-500">{errors.name}</p>}

        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-xs font-bold tracking-[0.12em] text-sage-300/70 uppercase">
            Email
          </label>
          <input id="reg-email" name="email" type="email" autoComplete="email" data-testid="reg-email" className={inputStyles} />
        </div>
        {errors.email && <p role="alert" className="text-xs font-semibold text-clay-500">{errors.email}</p>}

        <div>
          <label htmlFor="reg-phone" className="mb-1.5 block text-xs font-bold tracking-[0.12em] text-sage-300/70 uppercase">
            Phone
          </label>
          <input id="reg-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" data-testid="reg-phone" className={inputStyles} />
        </div>
        {errors.phone && <p role="alert" className="text-xs font-semibold text-clay-500">{errors.phone}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-pass" className="mb-1.5 block text-xs font-bold tracking-[0.12em] text-sage-300/70 uppercase">
              Password
            </label>
            <input id="reg-pass" name="password" type="password" autoComplete="new-password" data-testid="reg-pass" className={inputStyles} />
            {errors.password && <p role="alert" className="mt-1 text-xs font-semibold text-clay-500">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="reg-confirm" className="mb-1.5 block text-xs font-bold tracking-[0.12em] text-sage-300/70 uppercase">
              Confirm
            </label>
            <input id="reg-confirm" name="confirm" type="password" autoComplete="new-password" data-testid="reg-confirm" className={inputStyles} />
            {errors.confirm && <p role="alert" className="mt-1 text-xs font-semibold text-clay-500">{errors.confirm}</p>}
          </div>
        </div>

        <Button type="submit" variant="bronze" size="lg" magnetic className="w-full" disabled={busy} data-testid="reg-submit">
          {busy ? 'Creating…' : 'Create account'}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-sage-300/45">
          Demo prototype — accounts live only in this browser session and no password is ever stored.
        </p>
      </form>
    </AuthLayout>
  )
}
