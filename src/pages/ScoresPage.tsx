import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useKV } from '@github/spark/hooks'
import { SiteSettings } from '@/types'
import { defaultSiteSettings } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Info, Table, Trophy, CalendarBlank, ArrowSquareOut, WarningCircle } from '@phosphor-icons/react'

function PlayCricketEmbed({ html, title }: { html: string; title: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = html
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

interface PlayCricketMatch {
  id: number
  status: string
  published: string
  last_updated: string
  match_date: string
  match_time: string
  home_team_name: string
  away_team_name: string
  ground_name: string
  ground_town: string
  competition_name: string
  home_team_runs?: number | string
  home_team_wickets?: number | string
  away_team_runs?: number | string
  away_team_wickets?: number | string
  result?: string
  toss_won_by_home_team?: string
  match_result?: string
}

function MatchCard({ match, type }: { match: PlayCricketMatch; type: 'fixture' | 'result' }) {
  const isHome = match.home_team_name?.toLowerCase().includes('kashmir')
  const opponent = isHome ? match.away_team_name : match.home_team_name
  const homeScore = match.home_team_runs !== undefined
    ? `${match.home_team_runs}${match.home_team_wickets !== undefined && match.home_team_wickets !== '' ? `/${match.home_team_wickets}` : ''}`
    : null
  const awayScore = match.away_team_runs !== undefined
    ? `${match.away_team_runs}${match.away_team_wickets !== undefined && match.away_team_wickets !== '' ? `/${match.away_team_wickets}` : ''}`
    : null

  const dateStr = match.match_date
    ? new Date(match.match_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="outline" className="text-xs shrink-0">{match.competition_name || 'League'}</Badge>
          <span className="text-xs text-muted-foreground text-right">{dateStr}{match.match_time ? ` · ${match.match_time}` : ''}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <p className="font-bold text-primary">{match.home_team_name}</p>
            {homeScore && <p className="text-lg font-semibold">{homeScore}</p>}
          </div>
          <div className="text-center px-3">
            <p className="text-xs text-muted-foreground uppercase font-semibold">vs</p>
          </div>
          <div className="flex-1 text-right">
            <p className="font-bold text-primary">{match.away_team_name}</p>
            {awayScore && <p className="text-lg font-semibold">{awayScore}</p>}
          </div>
        </div>
        {type === 'result' && match.result && (
          <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">{match.result}</p>
        )}
        {(match.ground_name || match.ground_town) && (
          <p className="text-xs text-muted-foreground mt-2">📍 {[match.ground_name, match.ground_town].filter(Boolean).join(', ')}</p>
        )}
        <div className="mt-1 text-xs text-muted-foreground">
          {isHome ? '🏠 Home' : `Away vs ${opponent}`}
        </div>
      </CardContent>
    </Card>
  )
}

function MatchSkeleton() {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ScoresPage() {
  const [settings] = useKV<SiteSettings>('site-settings', defaultSiteSettings)

  const rawSiteId = settings?.playCricketSiteId?.trim() || ''
  const teamId = settings?.playCricketTeamId?.trim() || ''
  const numericSiteId = settings?.playCricketNumericSiteId?.trim() || ''
  const apiToken = settings?.playCricketApiToken?.trim() || ''

  const hasLeagueTable = settings?.playCricketLeagueTableWidget
  const hasResults = settings?.playCricketResultsWidget
  const hasFixtures = settings?.playCricketFixturesWidget
  const hasAnyWidget = hasLeagueTable || hasResults || hasFixtures
  const hasApiConfig = Boolean(numericSiteId && apiToken)

  // Build base URL → supports full URL or subdomain slug e.g. "kashmirrangers"
  const clubBaseUrl = rawSiteId.startsWith('http')
    ? rawSiteId.replace(/\/$/, '')
    : rawSiteId
      ? `https://${rawSiteId}.play-cricket.com`
      : 'https://kashmirrangers.play-cricket.com'

  const teamUrl = teamId ? `${clubBaseUrl}/Teams/${teamId}` : clubBaseUrl
  const fixturesUrl = `${clubBaseUrl}/Matches?tab=Fixture`
  const resultsUrl = `${clubBaseUrl}/Matches?tab=Result`
  const tableUrl = `${clubBaseUrl}/website/division_tables`

  // Play-Cricket API v2 — live data if token + numeric site ID configured
  const { data: apiData, isLoading: apiLoading, error: apiError } = useQuery({
    queryKey: ['play-cricket-matches', numericSiteId, apiToken],
    queryFn: async () => {
      const res = await fetch(
        `https://play-cricket.com/api/v2/matches.json?site_id=${numericSiteId}&api_token=${apiToken}&sort=date`
      )
      if (!res.ok) throw new Error(`Play-Cricket API error: ${res.status}`)
      return res.json() as Promise<{ matches: PlayCricketMatch[] }>
    },
    enabled: hasApiConfig,
    staleTime: 1000 * 60 * 15, // 15 min cache
    retry: 1,
  })

  const allMatches: PlayCricketMatch[] = apiData?.matches ?? []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const fixtures = allMatches.filter(m => m.status === 'New' || new Date(m.match_date) >= today)
  const results = allMatches.filter(m => m.status === 'Completed' || (m.home_team_runs !== undefined && new Date(m.match_date) < today))

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase tracking-tight text-primary mb-4">
            Scores &amp; Tables
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow our performance in the London National Cricket League (NCL), LMS, and T20/T10 tournaments
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {hasAnyWidget ? (
            // Admin has pasted widget embed codes
            <Tabs defaultValue={hasFixtures ? 'fixtures' : hasResults ? 'results' : 'table'} className="space-y-8">
              <TabsList className="grid w-full max-w-2xl mx-auto" style={{ gridTemplateColumns: `repeat(${[hasFixtures, hasResults, hasLeagueTable].filter(Boolean).length}, 1fr)` }}>
                {hasFixtures && <TabsTrigger value="fixtures" className="gap-2"><CalendarBlank size={20} weight="bold" />Fixtures</TabsTrigger>}
                {hasResults && <TabsTrigger value="results" className="gap-2"><Trophy size={20} weight="bold" />Results</TabsTrigger>}
                {hasLeagueTable && <TabsTrigger value="table" className="gap-2"><Table size={20} weight="bold" />League Table</TabsTrigger>}
              </TabsList>
              {hasFixtures && (
                <TabsContent value="fixtures">
                  <Card><CardContent className="p-8">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">Upcoming Fixtures</h2>
                    <PlayCricketEmbed html={settings.playCricketFixturesWidget || ''} title="Play-Cricket fixtures widget" />
                  </CardContent></Card>
                </TabsContent>
              )}
              {hasResults && (
                <TabsContent value="results">
                  <Card><CardContent className="p-8">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">Recent Results</h2>
                    <PlayCricketEmbed html={settings.playCricketResultsWidget || ''} title="Play-Cricket results widget" />
                  </CardContent></Card>
                </TabsContent>
              )}
              {hasLeagueTable && (
                <TabsContent value="table">
                  <Card><CardContent className="p-8">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">League Table</h2>
                    <PlayCricketEmbed html={settings.playCricketLeagueTableWidget || ''} title="Play-Cricket league table widget" />
                  </CardContent></Card>
                </TabsContent>
              )}
            </Tabs>
          ) : hasApiConfig ? (
            // Live API data
            <div className="space-y-8">
              {apiError && (
                <Alert>
                  <WarningCircle size={20} className="text-destructive" />
                  <AlertDescription>Could not load live data from Play-Cricket API. Check your API token and site ID in Admin settings.</AlertDescription>
                </Alert>
              )}
              <Tabs defaultValue="fixtures" className="space-y-6">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                  <TabsTrigger value="fixtures" className="gap-2"><CalendarBlank size={18} weight="bold" />Fixtures</TabsTrigger>
                  <TabsTrigger value="results" className="gap-2"><Trophy size={18} weight="bold" />Results</TabsTrigger>
                  <TabsTrigger value="table" className="gap-2"><Table size={18} weight="bold" />Table</TabsTrigger>
                </TabsList>

                <TabsContent value="fixtures">
                  <div className="space-y-4">
                    {apiLoading
                      ? Array.from({ length: 3 }).map((_, i) => <MatchSkeleton key={i} />)
                      : fixtures.length > 0
                        ? fixtures.map(m => <MatchCard key={m.id} match={m} type="fixture" />)
                        : <Card><CardContent className="p-8 text-center text-muted-foreground">No upcoming fixtures found.</CardContent></Card>
                    }
                    <div className="text-center pt-2">
                      <a href={fixturesUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                        View all fixtures on Play-Cricket <ArrowSquareOut size={16} />
                      </a>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="results">
                  <div className="space-y-4">
                    {apiLoading
                      ? Array.from({ length: 3 }).map((_, i) => <MatchSkeleton key={i} />)
                      : results.length > 0
                        ? results.map(m => <MatchCard key={m.id} match={m} type="result" />)
                        : <Card><CardContent className="p-8 text-center text-muted-foreground">No results found.</CardContent></Card>
                    }
                    <div className="text-center pt-2">
                      <a href={resultsUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                        View all results on Play-Cricket <ArrowSquareOut size={16} />
                      </a>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <Card>
                    <CardContent className="p-8 space-y-4 text-center">
                      <Table size={48} weight="bold" className="text-primary mx-auto" />
                      <p className="text-muted-foreground">Live league tables are not available via the Play-Cricket API. Click below to view the current standings.</p>
                      <a href={tableUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors">
                        View League Table <ArrowSquareOut size={18} />
                      </a>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Fallback: direct link cards to Play-Cricket pages
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href={fixturesUrl} target="_blank" rel="noopener noreferrer" className="group">
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

                <a href={resultsUrl} target="_blank" rel="noopener noreferrer" className="group">
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

                <a href={tableUrl} target="_blank" rel="noopener noreferrer" className="group">
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
                  <p className="text-muted-foreground text-sm">
                    Want live scores on this page?{' '}
                    <a href="/admin" className="text-primary hover:underline font-medium">Go to Admin Dashboard</a>{' '}
                    and add your Play-Cricket API token and site ID for live match data, or paste embed widget codes.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-center pt-12">
            <a
              href={teamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
            >
              View Full Statistics on Play-Cricket <ArrowSquareOut size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}


