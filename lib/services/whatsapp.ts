const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL!
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY!
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME!

export async function sendWhatsAppText(
  number: string,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  const digits = number.replace(/\D/g, '')

  try {
    const res = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: EVOLUTION_API_KEY,
        },
        body: JSON.stringify({ number: digits, text }),
      },
    )

    if (!res.ok) {
      const body = await res.text()
      return { ok: false, error: `${res.status} ${body}` }
    }

    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
