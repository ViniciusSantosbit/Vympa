import type { Client } from '../types/content'
export function clientLogoKey(client: Client): string {
  return client.id + ':' + client.logoUrl
}
export function validateClients(clients: readonly Client[]): Client[] {
  const ids = new Set<string>(),
    names = new Set<string>(),
    logos = new Set<string>()
  return clients.filter((client) => {
    if (
      client.autorizadoParaDivulgacao !== true ||
      typeof client.id !== 'string' ||
      !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i.test(client.id) ||
      !client.nome?.trim() ||
      !client.textoAlternativo?.trim() ||
      !client.logoUrl ||
      !/^\/images\/clientes\/[a-z0-9][a-z0-9/_-]*\.(svg|png|webp)$/i.test(
        client.logoUrl,
      )
    )
      return false
    const id = client.id.toLowerCase(),
      name = client.nome
        .trim()
        .replace(/\s+/g, ' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(),
      logo = client.logoUrl.toLowerCase()
    if (ids.has(id) || names.has(name) || logos.has(logo)) return false
    ids.add(id)
    names.add(name)
    logos.add(logo)
    return true
  })
}
export function getCarouselBounds(
  scrollWidth: number,
  clientWidth: number,
  scrollLeft: number,
) {
  const maximum = Math.max(0, scrollWidth - clientWidth)
  return {
    overflow: maximum > 1,
    atStart: scrollLeft <= 1,
    atEnd: scrollLeft >= maximum - 1,
  }
}
