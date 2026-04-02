import { useKV } from '@github/spark/hooks'
import { Content, SiteSettings } from '@/types'
import { defaultContent, defaultSiteSettings } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Target, TrendUp } from '@phosphor-icons/react'

interface HeroSettings {
  backgroundImage: string
  title: string
  subtitle: string
}

export function HomePage() {
  const [content] = useKV<Content>('content', defaultContent)
  const [settings] = useKV<SiteSettings>('site-settings', defaultSiteSettings)
  const [heroSettings] = useKV<HeroSettings>('hero-settings', {
    backgroundImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600',
    title: '',
    subtitle: 'The Ranger Standard: Excellence, Teamwork, Legacy'
  })

  const features = [
    {
      icon: Trophy,
      title: 'Championship Legacy',
      description: 'Creating a winning culture across all levels of competition'
    },
    {
      icon: Target,
      title: 'High Standards',
      description: 'Excellence on and off the field in everything we do'
    },
    {
      icon: TrendUp,
      title: 'Continuous Growth',
      description: 'Year-round training and player development programs'
    }
  ]

  return (
    <div className="min-h-screen">
      <section
        className="relative h-[600px] flex items-center justify-center text-white bg-gradient-to-br from-primary via-deep-navy to-primary/80"
        style={{
          backgroundImage: `linear-gradient(rgba(28, 58, 94, 0.85), rgba(28, 58, 94, 0.85)), url(${heroSettings?.backgroundImage || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-6 animate-fade-up">
            {heroSettings?.title || settings?.clubName || 'Kashmir Rangers Cricket Club'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-medium tracking-wide animate-fade-up animation-delay-200">
            {heroSettings?.subtitle || 'The Ranger Standard: Excellence, Teamwork, Legacy'}
          </p>
          {content?.homeAnnouncement && (
            <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-accent animate-fade-up animation-delay-400">
              <CardContent className="p-6">
                <p className="text-foreground text-lg leading-relaxed">{content.homeAnnouncement}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold uppercase tracking-tight text-primary mb-4">
              About the Rangers
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="mb-12 border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-primary uppercase tracking-wide">The Ranger Standard</h3>
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                  {content?.rangerStandard}
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                        <Icon size={32} weight="bold" className="text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {settings?.playCricketSiteId && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold uppercase tracking-tight text-primary mb-4">
                Latest from Play-Cricket
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto"></div>
            </div>
            <div className="max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground text-lg mb-4">
                    Follow our latest matches, scores, and statistics on Play-Cricket.
                  </p>
                  <a
                    href={`https://www.play-cricket.com/website/${settings.playCricketSiteId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                  >
                    Visit Our Play-Cricket Page
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
