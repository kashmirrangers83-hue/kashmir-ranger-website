import { useKV } from '@github/spark/hooks'
import { Content } from '@/types'
import { defaultContent } from '@/lib/defaults'

export function AboutPage() {
  const [content] = useKV<Content>('content', defaultContent)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase tracking-tight text-primary mb-4">
            About Us
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
            {content?.aboutPage}
          </div>
        </div>
      </div>
    </div>
  )
}
