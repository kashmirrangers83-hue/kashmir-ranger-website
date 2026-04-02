import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { SiteSettings } from '@/types'
import { defaultSiteSettings } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, Table, Trophy, CalendarBlank, ArrowSquareOut } from '@phosphor-icons/react'

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

  // Support full URL or bare numeric ID
  const playCricketBaseUrl = siteId.startsWith('http')
    ? siteId
    : siteId ? `https://www.play-cricket.com/website/${siteId}` : ''
  const hasSiteId = Boolean(playCricketBaseUrl)

  // Derive sub-page URLs - works for both URL formats
  const teamRootUrl = playCricketBaseUrl
  const fixturesUrl = playCricketBaseUrl.includes('play-cricket.com/Teams')
    ? playCricketBaseUrl.replace('/Teams/', '/website_fixture_results/') + '?result_type=fixtures'
    : `${playCricketBaseUrl}/fixtures`
  const resultsUrl = playCricketBaseUrl.includes('play-cricket.com/Teams')
    ? playCricketBaseUrl.replace('/Teams/', '/website_fixture_results/') + '?result_type=results'
    : `${playCricketBaseUrl}/results`
  const tableUrl = playCricketBaseUrl.includes('play-cricket.com/Teams')
    ? 'https://kashmirrangers.play-cricket.com/home'
    : `${playCricketBaseUrl}/division_tables`

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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={fixturesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CalendarBlank size={28} weight="bold" className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight text-primary">Fixtures</h3>
                        <p className="text-muted-foreground text-sm mt-1">Upcoming matches and schedule</p>
                      </div>
                      <ArrowSquareOut size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </a>

                <a
                  href={resultsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Trophy size={28} weight="bold" className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight text-primary">Results</h3>
                        <p className="text-muted-foreground text-sm mt-1">Latest match results and scores</p>
                      </div>
                      <ArrowSquareOut size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </a>

                <a
                  href={tableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Table size={28} weight="bold" className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight text-primary">League Table</h3>
                        <p className="text-muted-foreground text-sm mt-1">Current standings and points</p>
                      </div>
                      <ArrowSquareOut size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </a>
              </div>

              <Card className="border-dashed">
                <CardContent className="p-6 flex items-start gap-4">
                  <Info size={22} className="text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">
                    Live widget integration available — paste your Play-Cricket embed codes in the{' '}
                    <a href="/admin" className="text-primary hover:underline font-medium">Admin Dashboard</a>{' '}
                    to show fixtures, results and tables directly on this page.
                  </p>
                </CardContent>
              </Card>
            </div>
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
                href={teamRootUrl}
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
