import { useKV } from '@github/spark/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Image as ImageIcon } from '@phosphor-icons/react'

interface GalleryPhoto {
  id: string
  url: string
  caption?: string
  uploadedAt: number
}

export function GalleryPage() {
  const [photos] = useKV<GalleryPhoto[]>('gallery-photos', [])

  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-primary mb-4">
                Gallery
              </h1>
              <div className="w-24 h-1 bg-accent mx-auto"></div>
            </div>
            
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <ImageIcon size={48} weight="light" className="text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-wide mb-3">No Photos Yet</h2>
                <p className="text-muted-foreground text-lg">
                  Check back soon for photos from matches, training sessions, and club events.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-primary mb-4">
              Gallery
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Moments from our matches, training sessions, and club events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Gallery photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                {photo.caption && (
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground">{photo.caption}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
