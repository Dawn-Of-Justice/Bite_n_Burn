'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/common/Card'
import { useSettings } from '@/hooks/useSettings'
import { requestFCMToken } from '@/lib/firebase-client'

export function NotificationsCard() {
  const { settings, update } = useSettings()
  const [supported, setSupported] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSupported('Notification' in window && 'serviceWorker' in navigator)
  }, [])

  // Don't render during SSR or if browser lacks support
  if (supported === null || !supported || !settings) return null

  const enabled = !!settings.fcmToken
  const denied = Notification.permission === 'denied'

  const handleEnable = async () => {
    setLoading(true)
    const token = await requestFCMToken()
    if (token) update({ fcmToken: token })
    setLoading(false)
  }

  const handleDisable = () => update({ fcmToken: '' })

  return (
    <Card>
      <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>
        REMINDERS
      </h4>

      {denied ? (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
          Notifications are blocked. Enable them in your browser settings and reload.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border-color)', marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>Evening reminder</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{settings.eveningReminderTime}</span>
          </div>

          {enabled ? (
            <button
              onClick={handleDisable}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Disable Notifications
            </button>
          ) : (
            <button
              onClick={handleEnable}
              disabled={loading}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'var(--brand-forest)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Enabling…' : 'Enable Notifications'}
            </button>
          )}
        </>
      )}
    </Card>
  )
}
