import StarField from '@/components/StarField'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Thesis from '@/components/Thesis'
import Giants from '@/components/Giants'
import TheGame from '@/components/TheGame'
import SortingHat from '@/components/SortingHat'
import Resources from '@/components/Resources'
import JoinMovement from '@/components/JoinMovement'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <StarField />
      <Navbar />
      <main>
        <Hero />
        <Thesis />
        <Giants />
        <TheGame />
        <SortingHat />
        <Resources />
        <JoinMovement />
      </main>
      <Footer />
    </>
  )
}
