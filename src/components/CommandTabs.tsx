'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const TABS = [
  { id: 'capital', label: 'Capital' },
  { id: 'talent', label: 'Talent' },
  { id: 'markets', label: 'Markets' },
] as const

type TabId = (typeof TABS)[number]['id']

function tabFromHash(hash: string): TabId {
  const id = hash.replace('#', '')
  if (id === 'talent') return 'talent'
  if (id === 'markets' || id === 'idiot-index') return 'markets'
  return 'capital'
}

export default function CommandTabs({
  capital,
  talent,
  markets,
}: {
  capital: ReactNode
  talent: ReactNode
  markets: ReactNode
}) {
  const [tab, setTab] = useState<TabId>('capital')

  useEffect(() => {
    const apply = () => setTab(tabFromHash(window.location.hash))
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  function onChange(next: string) {
    const id = next as TabId
    setTab(id)
    const url = `${window.location.pathname}${window.location.search}#${id}`
    window.history.replaceState(null, '', url)
  }

  return (
    <Tabs value={tab} onValueChange={onChange} className="mt-8">
      <div className="sticky top-14 md:top-16 z-30 glass">
        <TabsList className="h-auto w-full justify-start bg-transparent p-0 gap-1">
          {TABS.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="h-11 px-4 text-small data-[state=active]:text-primary data-[state=active]:bg-accent">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="capital" id="capital" className="mt-6 scroll-mt-32">
        {capital}
      </TabsContent>
      <TabsContent value="talent" id="talent" className="mt-6 scroll-mt-32">
        {talent}
      </TabsContent>
      <TabsContent value="markets" id="markets" className="mt-6 scroll-mt-32">
        {markets}
      </TabsContent>
    </Tabs>
  )
}
