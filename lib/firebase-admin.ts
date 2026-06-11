import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getMessaging, type Messaging } from 'firebase-admin/messaging'

// Lazy init — the service account key is only required when a push is actually
// sent, so builds and routes that never send pushes don't need the env var.
let messaging: Messaging | null = null

export function adminMessaging(): Messaging {
  if (!messaging) {
    if (!getApps().length) {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable')
      }
      initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      })
    }
    messaging = getMessaging()
  }
  return messaging
}
