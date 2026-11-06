import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useState } from 'react'
import { FloatingContactButtons } from '@/components/common/FloatingContactButtons'
import { Team } from '@/sections/Team/Team'
import { Footer } from '@/sections/Footer/Footer'
import { Results } from '@/sections/Results/Results'
import { Plans } from '@/sections/Plans/Plans'
import { HowItWorks } from '@/sections/Plans/HowItWorks'
import type { ReactElement } from 'react'
import { Navbar } from '@/sections/Navbar/Navbar'
import { Hero } from '@/sections/Hero/Hero'
export default function App(): ReactElement {
  const revealRoot = useScrollReveal()
  const [resultsAvailable, setResultsAvailable] = useState(false)
  return (
    <>
      <Navbar resultsAvailable={resultsAvailable} />
      <main ref={revealRoot} id="main-content" tabIndex={-1}>
        <Hero />
        <Plans />
        <HowItWorks />
        <Results onAvailabilityChange={setResultsAvailable} />
        <Team />
      </main>
      <Footer />
      <FloatingContactButtons />
    </>
  )
}
