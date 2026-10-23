import { useQuery } from '@tanstack/react-query'
import { type ReactNode, createContext, useContext } from 'react'

import type { InferInput, InferOutput } from '@lifeforge/api'
import { useForgeMutation } from '@lifeforge/api'
import { WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { getPm25Status } from '@/utils/aqi'

export type Stats = InferOutput<typeof forgeAPI.stats.get>

export type ControlAction = InferInput<
  typeof forgeAPI.control.call
>['body']['action']

interface PurifierContextValue {
  stats: Stats
  pm25Status: ReturnType<typeof getPm25Status>
  pending: boolean
  onControl: (action: ControlAction, value?: string) => void
}

const PurifierContext = createContext<PurifierContextValue | null>(null)

export function PurifierProvider({ children }: { children: ReactNode }) {
  const statsQuery = useQuery(
    forgeAPI.stats.get.queryOptions({ refetchInterval: 10_000 })
  )

  const controlMutation = useForgeMutation(forgeAPI.control.call, {
    action: 'update',
    queryKey: forgeAPI.stats.key
  })

  function handleControl(action: ControlAction, value?: string) {
    controlMutation.mutate({ action, value })
  }

  return (
    <WithQuery query={statsQuery}>
      {(stats: Stats) => (
        <PurifierContext
          value={{
            stats,
            pm25Status: getPm25Status(stats.pm25),
            pending: controlMutation.isPending,
            onControl: handleControl
          }}
        >
          {children}
        </PurifierContext>
      )}
    </WithQuery>
  )
}

export function usePurifier() {
  const context = useContext(PurifierContext)

  if (!context) {
    throw new Error('usePurifier must be used within a PurifierProvider')
  }

  return context
}
