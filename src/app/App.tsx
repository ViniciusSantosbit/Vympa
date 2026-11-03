import { useEffect } from 'react'
import { cancelSectionNavigation } from '@/lib/sectionNavigation'
import { Plans } from '@/sections/Plans/Plans'
import { HowItWorks } from '@/sections/Plans/HowItWorks'
import type { ReactElement } from 'react'
import { Navbar } from '@/sections/Navbar/Navbar'
import { Hero } from '@/sections/Hero/Hero'
export default function App(): ReactElement {
  useEffect(() => cancelSectionNavigation, [])
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Plans />
        <HowItWorks />
      </main>
    </>
  )
}
