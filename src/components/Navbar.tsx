import NavbarClient from './NavbarClient'

/** Problems, capital, talent, markets, and discoveries. Every other page stays reachable by link. */
export default function Navbar({ onHero = false }: { onHero?: boolean }) {
  return <NavbarClient onHero={onHero} />
}
