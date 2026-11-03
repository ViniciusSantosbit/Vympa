import { useEffect, useState } from 'react'
import { cancelSectionNavigation } from '@/lib/sectionNavigation'
import { Team } from '@/sections/Team/Team'
import { Results } from '@/sections/Results/Results'
import { Plans } from '@/sections/Plans/Plans'
import { HowItWorks } from '@/sections/Plans/HowItWorks'
import type { ReactElement } from 'react'
import { Navbar } from '@/sections/Navbar/Navbar'
import { Hero } from '@/sections/Hero/Hero'
export default function App(): ReactElement {
  const [resultsAvailable, setResultsAvailable] = useState(false)
  useEffect(() => cancelSectionNavigation, [])
  return (
    <>
      <Navbar resultsAvailable={resultsAvailable} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Plans />
        <HowItWorks />
        <Results onAvailabilityChange={setResultsAvailable} />
        <Team />
      </main>
    </>
  )
}
