import { useKV } from '@github/spark/hooks'
import { Sponsor } from '@/types'
import { defaultSponsors } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, ArrowSquareOut } from '@phosphor-icons/react'

export function SponsorsPage() {
  const [sponsors] = useKV<Sponsor[]>('sponsors', defaultSponsors)

  const sortedSponsors = [...(sponsors || [])].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase tracking-tight text-primary mb-4">
            Our Sponsors
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We are grateful to our sponsors for their continued support in helping us maintain excellence
          </p>
        </div>

        {sortedSponsors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {sortedSponsors.map((sponsor) => (
              <Card 
                key={sponsor.id} 
                className="border-2 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <CardContent className="p-6">
                  {sponsor.websiteUrl ? (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center p-4 mb-4 group-hover:bg-muted/50 transition-colors">
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-center text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                        <span className="mr-2">{sponsor.name}</span>
                        <ArrowSquareOut size={16} weight="bold" />
                      </div>
                    </a>
                  ) : (
                    <>
                      <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center p-4 mb-4">
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="text-center text-sm font-semibold text-primary">
                        {sponsor.name}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert className="max-w-2xl mx-auto">
            <Info size={24} className="text-muted-foreground" />
            <AlertDescription className="text-lg">
              Sponsor information will be available soon. Interested in sponsoring Kashmir Rangers Cricket Club? Please get in touch!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
