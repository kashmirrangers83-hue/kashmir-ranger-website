import { useKV } from '@github/spark/hooks'
import { SiteSettings } from '@/types'
import { defaultSiteSettings } from '@/lib/defaults'
import { 
  TwitterLogo, 
  FacebookLogo, 
  InstagramLogo, 
  EnvelopeSimple, 
  Phone 
} from '@phosphor-icons/react'

export function Footer() {
  const [settings] = useKV<SiteSettings>('site-settings', defaultSiteSettings)

  const socialLinks = [
    { icon: TwitterLogo, url: settings.socialMedia.twitter, label: 'Twitter' },
    { icon: FacebookLogo, url: settings.socialMedia.facebook, label: 'Facebook' },
    { icon: InstagramLogo, url: settings.socialMedia.instagram, label: 'Instagram' },
    { icon: EnvelopeSimple, url: settings.socialMedia.email ? `mailto:${settings.socialMedia.email}` : undefined, label: 'Email' },
    { icon: Phone, url: settings.socialMedia.phone ? `tel:${settings.socialMedia.phone}` : undefined, label: 'Phone' }
  ].filter(link => link.url)

  return (
    <footer className="bg-deep-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            {settings.clubName}
          </h2>
          
          <p className="text-center text-white/80 max-w-2xl">
            London National Cricket League (NCL) | LMS | T20 & T10 Tournaments
          </p>

          {socialLinks.length > 0 && (
            <div className="flex items-center space-x-6">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label={link.label}
                  >
                    <Icon size={24} weight="fill" />
                  </a>
                )
              })}
            </div>
          )}

          <div className="border-t border-white/20 pt-6 w-full text-center">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} {settings.clubName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
