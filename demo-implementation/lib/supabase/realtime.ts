'use client'

import { useEffect, useRef } from 'react'
import { createClient } from './client'
import type { ConsultationMessage } from './types'

export function useConsultationRealtime(
  consultationId: string,
  onMessage: (message: ConsultationMessage) => void
) {
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`consultation:${consultationId}:messages`, {
      config: { private: true },
    })

    channelRef.current = channel

    void supabase.realtime.setAuth().then(() => {
      channel
        .on('broadcast', { event: 'INSERT' }, (payload) => {
          const record = (payload.payload as { record?: ConsultationMessage }).record ?? payload.payload
          onMessage(record as ConsultationMessage)
        })
        .subscribe()
    })

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [consultationId, onMessage])
}
