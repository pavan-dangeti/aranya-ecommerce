import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Address } from '@/types'
import { randomId } from '@/utils/misc'

interface AddressState {
  addresses: Address[]
  add: (input: Omit<Address, 'id'>) => void
  update: (id: string, input: Omit<Address, 'id'>) => void
  remove: (id: string) => void
  setDefault: (id: string) => void
}

export const useAddresses = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      add: (input) =>
        set((state) => {
          const address: Address = {
            ...input,
            id: randomId('adr'),
            isDefault: state.addresses.length === 0 ? true : input.isDefault,
          }
          return {
            addresses: [
              address,
              ...state.addresses.map((a) =>
                address.isDefault ? { ...a, isDefault: false } : a
              ),
            ],
          }
        }),
      update: (id, input) =>
        set((state) => ({
          addresses: state.addresses.map((a) => {
            if (a.id !== id) return input.isDefault ? { ...a, isDefault: false } : a
            return { ...a, ...input }
          }),
        })),
      remove: (id) =>
        set((state) => {
          const rest = state.addresses.filter((a) => a.id !== id)
          if (rest.length > 0 && !rest.some((a) => a.isDefault)) rest[0].isDefault = true
          return { addresses: rest }
        }),
      setDefault: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
    }),
    { name: 'aranya-addresses-v1' }
  )
)
