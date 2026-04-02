'use client'
import { SWRConfig } from 'swr'
import { useClerk } from '@clerk/nextjs'
import { fetcher, FetchError } from '@/lib/fetcher'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk()

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 10_000,
        onError(error) {
          if (error instanceof FetchError && error.status === 401) {
            signOut()
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
