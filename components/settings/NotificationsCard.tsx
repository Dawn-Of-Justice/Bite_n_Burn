'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/common/Card'
import { useSettings } from '@/hooks/useSettings'
import { requestFCMToken, setupForegroundMessages } from '@/lib/firebase-client'

export function NotificationsCard() {
  const { settings, update } = useSettings()
  const [supported, setSupported] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<string | null>(null)

  useEffect(() => {
    setSupported('Notification' in window && 'serviceWorker' in navigator)
  }, [])

  // Set up foreground message handler whenever notifications are enabled
  useEffect(() => {
    if (!settings?.fcmToken) return
    const unsub = setupForegroundMessages()
    return unsub
  }, [settings?.fcmToken])

  // Don't render during SSR or if browser lacks support
  if (supported === null || !supported || !settings) return null

  const enabled = !!settings.fcmToken
  const denied = Notification.permission === 'denied'

  const handleEnable = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await requestFCMToken()
      if (token) {
        await update({ fcmToken: token })
      } else {
        setError('Permission denied or browser unsupported.')
      }
    } catch (err) {
      console.error('Failed to enable notifications:', err)
      setError('Failed to enable. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = () => update({ fcmToken: '' })

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update({ eveningReminderTime: e.target.value })
  }

  const handleTestPush = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/test-push', { method: 'POST' })
      if (res.ok) {
        setTestResult('Sent! Check your notifications.')
      } else {
        const data = await res.json()
        setTestResult(`Failed: ${data.error}`)
      }
    } catch {
      setTestResult('Network error.')
    } finally {
      setTesting(false)
    }
  }

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
            <input
              type="time"
              value={settings.eveningReminderTime}
              onChange={handleTimeChange}
              style={{
                fontSize: 13,
                color: 'var(--text-primary)',
                background: 'var(--surface-elevated, var(--bg-card))',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            />
          </div>

          {enabled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={handleTestPush}
                disabled={testing}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'var(--brand-forest)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: testing ? 'default' : 'pointer', opacity: testing ? 0.7 : 1 }}
              >
                {testing ? 'Sending…' : 'Send Test Notification'}
              </button>
              {testResult && (
                <p style={{ margin: 0, fontSize: 12, color: testResult.startsWith('Sent') ? 'var(--brand-forest)' : 'var(--color-error, #e53e3e)', textAlign: 'center' }}>
                  {testResult}
                </p>
              )}
              <button
                onClick={handleDisable}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Disable Notifications
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleEnable}
                disabled={loading}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'var(--brand-forest)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Enabling…' : 'Enable Notifications'}
              </button>
              {error && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--color-error, #e53e3e)', textAlign: 'center' }}>
                  {error}
                </p>
              )}
            </>
          )}
        </>
      )}
    </Card>
  )
}
