import { adminMessaging } from '@/lib/firebase-admin'

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminMessaging.send({ token: fcmToken, notification: { title, body } })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
