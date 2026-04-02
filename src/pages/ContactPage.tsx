import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Content } from '@/types'
import { defaultContent } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MapPin, EnvelopeSimple, Phone } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function ContactPage() {
  const [content] = useKV<Content>('content', defaultContent)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase tracking-tight text-primary mb-4">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with Kashmir Rangers Cricket Club
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <Card className="border-2">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-base font-semibold">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={6}
                    className="mt-2"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full uppercase tracking-wide font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-2">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-6">
                  Club Information
                </h2>
                <div className="space-y-6">
                  {content?.contactInfo.address && (
                    <div className="flex items-start space-x-4">
                      <MapPin size={24} weight="bold" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Address</h3>
                        <p className="text-muted-foreground">{content.contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                  {content?.contactInfo.email && (
                    <div className="flex items-start space-x-4">
                      <EnvelopeSimple size={24} weight="bold" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                        <a
                          href={`mailto:${content.contactInfo.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {content.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {content?.contactInfo.phone && (
                    <div className="flex items-start space-x-4">
                      <Phone size={24} weight="bold" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Phone</h3>
                        <a
                          href={`tel:${content.contactInfo.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {content.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
