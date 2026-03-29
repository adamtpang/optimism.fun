import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HumanImpactStats from '@/components/HumanImpactStats'
import Thesis from '@/components/Thesis'
import FeaturedProblems from '@/components/FeaturedProblems'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HumanImpactStats />
        <Thesis />
        <FeaturedProblems />
      </main>
      <Footer />
    </>
  )
}
