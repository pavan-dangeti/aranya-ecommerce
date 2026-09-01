import { create } from 'zustand'
import type { User } from '@/types'

const LS_KEY = 'aranya-session-v1'
const SS_KEY = 'aranya-session-tab-v1'

interface AuthState {
  user: User | null
  login: (user: User, opts?: { remember?: boolean }) => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone'>>) => void
  logout: () => void
}

function readStored(): User | null {
  try {
    const raw = localStorage.getItem(LS_KEY) ?? sessionStorage.getItem(SS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { user?: User; state?: { user?: User } }
    return parsed.user ?? parsed.state?.user ?? null
  } catch {
    return null
  }
}

function writeStored(user: User, remember: boolean) {
  const payload = JSON.stringify({ user })
  try {
    if (remember) {
      localStorage.setItem(LS_KEY, payload)
      sessionStorage.removeItem(SS_KEY)
    } else {
      sessionStorage.setItem(SS_KEY, payload)
      localStorage.removeItem(LS_KEY)
    }
  } catch {
    /* storage unavailable — session continues in memory */
  }
}

function clearStored() {
  try {
    localStorage.removeItem(LS_KEY)
    sessionStorage.removeItem(SS_KEY)
  } catch {
    /* noop */
  }
}

function rewriteStored(user: User) {
  try {
    const raw = localStorage.getItem(LS_KEY) ?? sessionStorage.getItem(SS_KEY)
    if (!raw) return
    if (localStorage.getItem(LS_KEY)) localStorage.setItem(LS_KEY, JSON.stringify({ user }))
    else sessionStorage.setItem(SS_KEY, JSON.stringify({ user }))
  } catch {
    /* noop */
  }
}

export const useAuth = create<AuthState>()((set) => ({
  user: readStored(),
  login: (user, opts) => {
    writeStored(user, opts?.remember ?? false)
    set({ user })
  },
  updateProfile: (patch) =>
    set((state) => {
      if (!state.user) return state
      const user = { ...state.user, ...patch }
      rewriteStored(user)
      return { user }
    }),
  logout: () => {
    clearStored()
    set({ user: null })
  },
}))
