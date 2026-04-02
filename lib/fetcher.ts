export class FetchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'FetchError'
    this.status = status
  }
}

export async function fetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new FetchError(res.statusText, res.status)
  return res.json()
}
