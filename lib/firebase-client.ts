import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

function getApp() {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
}

/**
 * Requests notification permission and returns an FCM token.
 * Returns null if permission is denied or the browser is unsupported.
 * Must be called in a browser context (not SSR).
 */
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const messaging = getMessaging(getApp())
  const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

  return getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    serviceWorkerRegistration: swReg,
  })
}

/**
 * Shows notifications when the app is in the foreground.
 * FCM only fires the service worker when the tab is backgrounded/closed —
 * for foreground delivery we need this onMessage handler.
 * Returns an unsubscribe function.
 */
export function setupForegroundMessages(): () => void {
  if (typeof window === 'undefined') return () => {}
  const messaging = getMessaging(getApp())
  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? 'Bite & Burn'
    const body = payload.notification?.body ?? ''
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' })
    }
  })
}
