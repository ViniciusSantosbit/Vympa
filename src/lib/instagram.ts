export function validateInstagramUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (
      url.protocol !== 'https:' ||
      !['instagram.com', 'www.instagram.com'].includes(url.hostname) ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash
    )
      return null
    const match = /^\/([a-zA-Z0-9._]{1,30})\/?$/.exec(url.pathname)
    if (
      !match?.[1] ||
      [
        'accounts',
        'direct',
        'explore',
        'p',
        'reel',
        'reels',
        'stories',
        'about',
        'developer',
        'legal',
      ].includes(match[1].toLowerCase()) ||
      match[1].startsWith('.') ||
      match[1].endsWith('.') ||
      match[1].includes('..')
    )
      return null
    return url.href
  } catch {
    return null
  }
}
