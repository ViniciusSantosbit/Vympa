import type { ReactElement } from 'react'
import type { TeamMember } from '@/types/content'
import { equipe, teamContent } from '@/content/equipe'
import { selectTeamMembers } from '@/lib/team'
import { TeamMemberCard } from './TeamMemberCard'
import './team.css'
export function Team({
  members = equipe,
  includeDrafts = import.meta.env.DEV,
}: {
  members?: readonly TeamMember[]
  includeDrafts?: boolean
}): ReactElement | null {
  const visible = selectTeamMembers(members, includeDrafts)
  if (visible.length === 0) return null
  return (
    <section
      id="nosso-time"
      className="team-section"
      aria-labelledby="team-title"
    >
      <div className="team-container">
        <h2 data-reveal id="team-title" tabIndex={-1}>
          {teamContent.title}
        </h2>
        <div className="team-grid">
          {visible.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
