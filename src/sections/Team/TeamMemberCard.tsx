import { useState } from 'react'
import type { ReactElement } from 'react'
import type { TeamMember } from '@/types/content'
import { teamContent } from '@/content/equipe'
import { isTeamPhotoPath } from '@/lib/team'
export function TeamMemberCard({
  member,
}: {
  member: TeamMember
}): ReactElement {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const hasDetails = Boolean(member.nome || member.cargo || member.descricao)
  const hasPhoto =
    isTeamPhotoPath(member.fotoUrl) && failedSource !== member.fotoUrl
  const titleId = 'team-' + member.id + '-name'
  return (
    <article
      className="team-member"
      data-member={member.id}
      data-has-details={hasDetails}
      aria-labelledby={member.nome ? titleId : undefined}
      aria-label={
        member.nome
          ? undefined
          : teamContent.photoAreaLabel + ' ' + member.ordem
      }
    >
      <div className="team-photo">
        {hasPhoto && (
          <img
            src={member.fotoUrl!}
            alt={member.textoAlternativo}
            width="315"
            height="400"
            loading="lazy"
            decoding="async"
            style={{ objectPosition: member.posicaoFoto || '50% 40%' }}
            onError={() => setFailedSource(member.fotoUrl)}
          />
        )}
      </div>
      <div className="team-overlay" aria-hidden="true" />
      <div className="team-member-info">
        {member.nome && <h3 id={titleId}>{member.nome}</h3>}
        {member.cargo && <p className="team-role">{member.cargo}</p>}
        {member.descricao && (
          <p className="team-description">{member.descricao}</p>
        )}
      </div>
    </article>
  )
}
