import NavbarClient from './NavbarClient'

/** Problems, capital, talent, markets, discoveries, and research. Every other page stays reachable by link. */
export default function Navbar({ onHero = false }: { onHero?: boolean }) {
  return <NavbarClient onHero={onHero} />
}
