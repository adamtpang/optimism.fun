/**
 * The three kinds of visitor, and the one color each owns.
 *
 * A class color appears only on that class's call to action and its labels.
 * The class names below are written out in full so Tailwind can see them;
 * do not build them from strings.
 */
import type { ActorType, Intent } from '@/lib/commitments'

export type VisitorClassId = 'patron' | 'founder' | 'researcher'

export type VisitorClass = {
  id: VisitorClassId
  label: string
  /** Who this is, in one plain line. */
  who: string
  /** The default ask. Pages may replace it with a more specific one. */
  ask: string
  /** The actor and intent the commitment area starts on for this class. */
  commitment: { actor: ActorType; intent: Intent }
  /** Solid button: fill, the text that sits on it, and a border. */
  solid: string
  /** The class color as text on white or paper. */
  text: string
  /** A soft panel in the class tint, with an ink rule. */
  panel: string
}

export const VISITOR_CLASSES: VisitorClass[] = [
  {
    id: 'patron',
    label: 'Patron',
    who: 'You have capital and decide where it goes.',
    ask: 'Fund this gap',
    commitment: { actor: 'capital', intent: 'fund' },
    solid: 'bg-patron text-patron-on border border-patron-ink hover:brightness-95',
    text: 'text-patron-ink',
    panel: 'bg-patron-tint border-l-4 border-patron-ink',
  },
  {
    id: 'founder',
    label: 'Founder',
    who: 'You build, or you join people who do.',
    ask: 'Start or join this quest',
    commitment: { actor: 'talent', intent: 'start' },
    solid: 'bg-founder text-founder-on border border-founder-ink hover:brightness-95',
    text: 'text-founder-ink',
    panel: 'bg-founder-tint border-l-4 border-founder-ink',
  },
  {
    id: 'researcher',
    label: 'Researcher',
    who: 'You check the numbers and extend what is known.',
    ask: 'Fix or extend this number',
    commitment: { actor: 'talent', intent: 'contribute' },
    solid: 'bg-researcher text-researcher-on border border-researcher-ink hover:brightness-95',
    text: 'text-researcher-ink',
    panel: 'bg-researcher-tint border-l-4 border-researcher-ink',
  },
]

/** The query key a class link carries, as in /p/loneliness?as=patron#coordinate. */
export const VISITOR_CLASS_PARAM = 'as'

export function visitorClass(id: string | null | undefined): VisitorClass | undefined {
  return VISITOR_CLASSES.find((c) => c.id === id)
}

/** A link to a problem's commitment area, set to one class. */
export function commitHref(problemSlug: string, id: VisitorClassId): string {
  return `/p/${problemSlug}?${VISITOR_CLASS_PARAM}=${id}#coordinate`
}
