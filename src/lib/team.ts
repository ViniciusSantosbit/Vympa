import type { TeamMember } from '../types/content'
export function isTeamPhotoPath(path: string | null): path is string {
  return Boolean(
    path &&
    /^\/images\/equipe\/[a-z0-9][a-z0-9/_-]*\.(webp|avif|png|jpe?g)$/i.test(
      path,
    ),
  )
}
export function selectTeamMembers(
  members: readonly TeamMember[],
  includeDrafts: boolean,
): TeamMember[] {
  const ids = new Set<string>()
  return members
    .filter((member) => {
      if (
        !member.id.trim() ||
        ids.has(member.id) ||
        !Number.isInteger(member.ordem) ||
        member.ordem < 1
      )
        return false
      const publishable =
        member.status === 'publicado' &&
        Boolean(
          member.nome.trim() &&
          member.cargo.trim() &&
          member.textoAlternativo.trim(),
        ) &&
        isTeamPhotoPath(member.fotoUrl)
      if (!includeDrafts && !publishable) return false
      ids.add(member.id)
      return true
    })
    .sort((a, b) => a.ordem - b.ordem)
}
