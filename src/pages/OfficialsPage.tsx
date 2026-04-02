import { useKV } from '@github/spark/hooks'
import { Official } from '@/types'
import { defaultOfficials } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from '@phosphor-icons/react'

export function OfficialsPage() {
  const [officials] = useKV<Official[]>('officials', defaultOfficials)

  const sortedOfficials = [...(officials || [])].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase tracking-tight text-primary mb-4">
            Club Committee
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the leadership team dedicated to upholding the Ranger Standard
          </p>
        </div>

        {sortedOfficials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sortedOfficials.map((official) => (
              <Card key={official.id} className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    {official.photoUrl ? (
                      <img
                        src={official.photoUrl}
                        alt={official.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto bg-accent/10 flex items-center justify-center border-4 border-accent/20">
                        <User size={48} weight="bold" className="text-primary" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide">
                    {official.name}
                  </h3>
                  <Badge className="uppercase tracking-wide font-semibold">
                    {official.role}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert className="max-w-2xl mx-auto">
            <Info size={24} className="text-muted-foreground" />
            <AlertDescription className="text-lg">
              Committee information will be available soon.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
