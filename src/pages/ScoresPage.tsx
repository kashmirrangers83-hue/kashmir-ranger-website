import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { SiteSettings } from '@/types'
import { defaultSiteSettings } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, Table, Trophy, CalendarBlank } from '@phosphor-icons/react'

function PlayCricketEmbed({ html, title }: { html: string; title: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = html

    // Scripts inside innerHTML do not execute automatically in React.
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      newScript.text = oldScript.text
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [html])

  return <div ref={containerRef} className="w-full overflow-x-auto" aria-label={title} />
}

export function ScoresPage() {
  const [settings] = useKV<SiteSettings>('site-settings', defaultSiteSettings)
  const siteId = settings?.playCricketSiteId?.trim() || ''

  const hasLeagueTable = settings?.playCricketLeagueTableWidget
  const hasResults = settings?.playCricketResultsWidget
  const hasFixtures = settings?.playCricketFixturesWidget
  const hasAnyWidget = hasLeagueTable || hasResults || hasFixtures
  const hasSiteId = Boolean(siteId)
  const playCricketBaseUrl = hasSiteId ? `https://www.play-cricket.com/website/${siteId}` : ''

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase tracking-tight text-primary mb-4">
            Scores & Tables
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow our performance in the London National Cricket League (NCL), LMS, and T20/T10 tournaments
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {hasAnyWidget ? (
            <Tabs defaultValue={hasFixtures ? 'fixtures' : hasResults ? 'results' : 'table'} className="space-y-8">
              <TabsList className="grid w-full max-w-2xl mx-auto" style={{ gridTemplateColumns: `repeat(${[hasFixtures, hasResults, hasLeagueTable].filter(Boolean).length}, 1fr)` }}>
                {hasFixtures && (
                  <TabsTrigger value="fixtures" className="gap-2">
                    <CalendarBlank size={20} weight="bold" />
                    Fixtures
                  </TabsTrigger>
                )}
                {hasResults && (
                  <TabsTrigger value="results" className="gap-2">
                    <Trophy size={20} weight="bold" />
                    Results
                  </TabsTrigger>
                )}
                {hasLeagueTable && (
                  <TabsTrigger value="table" className="gap-2">
                    <Table size={20} weight="bold" />
                    League Table
                  </TabsTrigger>
                )}
              </TabsList>

              {hasFixtures && (
                <TabsContent value="fixtures">
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">
                        Upcoming Fixtures
                      </h2>
                      <PlayCricketEmbed html={settings.playCricketFixturesWidget || ''} title="Play-Cricket fixtures widget" />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {hasResults && (
                <TabsContent value="results">
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">
                        Recent Results
                      </h2>
                      <PlayCricketEmbed html={settings.playCricketResultsWidget || ''} title="Play-Cricket results widget" />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {hasLeagueTable && (
                <TabsContent value="table">
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">
                        League Table
                      </h2>
                      <PlayCricketEmbed html={settings.playCricketLeagueTableWidget || ''} title="Play-Cricket league table widget" />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          ) : hasSiteId ? (
            <Card>
              <CardContent className="p-8 space-y-6">
                <h2 className="text-3xl font-bold uppercase tracking-tight text-primary">
                  Play-Cricket Dashboard
                </h2>
                <p className="text-muted-foreground text-lg">
                  Quick fallback integration is active using your Play-Cricket site ID. You can still add official widgets in Admin for richer fixtures/results/table views.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`${playCricketBaseUrl}/fixtures`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-md font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                  >
                    Fixtures
                  </a>
                  <a
                    href={`${playCricketBaseUrl}/results`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-md font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                  >
                    Results
                  </a>
                  <a
                    href={`${playCricketBaseUrl}/division_tables`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-md font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                  >
                    League Table
                  </a>
                </div>
                <div className="rounded-md overflow-hidden border">
                  <iframe
                    title="Play-Cricket site"
                    src={playCricketBaseUrl}
                    className="w-full min-h-[960px]"
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="max-w-2xl mx-auto">
              <Info size={24} className="text-muted-foreground" />
              <AlertDescription className="text-lg">
                Play-Cricket widgets have not been configured yet. Please check back soon for live scores and league tables.
              </AlertDescription>
            </Alert>
          )}

          {hasSiteId && (
            <div className="text-center pt-12">
              <a
                href={playCricketBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
              >
                View Full Statistics on Play-Cricket
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
