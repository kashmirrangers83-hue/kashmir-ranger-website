import { SiteSettings, Content, Official, Sponsor } from '@/types'

export const defaultSiteSettings: SiteSettings = {
  clubName: 'Kashmir Rangers Cricket Club',
  socialMedia: {
    email: 'info@kashmirrangers.cricket',
    phone: '+44 20 1234 5678',
    twitter: 'https://twitter.com/kashmirrangers',
    facebook: 'https://facebook.com/kashmirrangers',
    instagram: 'https://instagram.com/kashmirrangers'
  },
  playCricketSiteId: '12345',
  playCricketLeagueTableWidget: '',
  playCricketResultsWidget: ''
}

export const defaultContent: Content = {
  rangerStandard: 'The Ranger Standard represents our unwavering commitment to excellence. We believe in achieving success as a team, club, and individual player. Our philosophy centers on creating a winning culture and lasting legacy, while showcasing the highest standards both on and off the field. Every ranger embodies professionalism, sportsmanship, and dedication to continuous improvement.',
  aboutPage: `Welcome to Kashmir Rangers Cricket Club, where tradition meets excellence in the heart of London's vibrant cricket community.

Since our founding, we have been more than just a cricket club—we are a family united by our passion for the game and commitment to the Ranger Standard. Our club thrives on a culture of inclusivity, professionalism, and relentless pursuit of excellence.

**Year-Round Training**
We maintain rigorous training schedules throughout the year, ensuring our players are always match-ready. Our state-of-the-art facilities and experienced coaching staff provide the perfect environment for players to hone their skills and reach their full potential.

**Competitive Excellence**
Kashmir Rangers proudly compete in the prestigious London National Cricket League (NCL), as well as various LMS, T20, and T10 tournaments. Our competitive spirit drives us to perform at the highest level, while our sportsmanship earns us respect across the cricket community.

**A City-Like Vibrancy**
Our club pulses with energy and diversity, bringing together players from various backgrounds united by their love for cricket. This vibrant atmosphere creates an environment where friendships flourish and memories are made.

**The Ranger Legacy**
Every player who wears our colors contributes to a legacy of excellence that spans generations. We take pride in developing not just skilled cricketers, but well-rounded individuals who carry the Ranger Standard into every aspect of their lives.

Join us in our journey to cricketing excellence.`,
  homeAnnouncement: 'Welcome to the 2024 season! Training sessions commence every Saturday at 9 AM. New players welcome.',
  contactInfo: {
    address: 'Rangers Ground, Cricket Lane, London, UK',
    email: 'info@kashmirrangers.cricket',
    phone: '+44 20 1234 5678'
  }
}

export const defaultOfficials: Official[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Chairman',
    order: 1
  },
  {
    id: '2',
    name: 'Mohammed Hassan',
    role: 'Club Secretary',
    order: 2
  },
  {
    id: '3',
    name: 'Amir Khan',
    role: '1st XI Captain',
    order: 3
  },
  {
    id: '4',
    name: 'Sameer Patel',
    role: '2nd XI Captain',
    order: 4
  },
  {
    id: '5',
    name: 'David Singh',
    role: 'Head Coach',
    order: 5
  },
  {
    id: '6',
    name: 'Sarah Ahmed',
    role: 'Treasurer',
    order: 6
  }
]

export const defaultSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'London Cricket Gear',
    logoUrl: 'https://via.placeholder.com/200x100/1c3a5e/ffffff?text=London+Cricket+Gear',
    websiteUrl: 'https://example.com',
    order: 1
  },
  {
    id: '2',
    name: 'Kashmir Foods',
    logoUrl: 'https://via.placeholder.com/200x100/1c3a5e/ffffff?text=Kashmir+Foods',
    websiteUrl: 'https://example.com',
    order: 2
  },
  {
    id: '3',
    name: 'Sports Direct',
    logoUrl: 'https://via.placeholder.com/200x100/1c3a5e/ffffff?text=Sports+Direct',
    websiteUrl: 'https://example.com',
    order: 3
  },
  {
    id: '4',
    name: 'Rangers Insurance',
    logoUrl: 'https://via.placeholder.com/200x100/1c3a5e/ffffff?text=Rangers+Insurance',
    websiteUrl: 'https://example.com',
    order: 4
  }
]

export const ADMIN_CREDENTIALS = {
  email: 'admin@kashmirrangers.cricket',
  password: 'Rangers2024!'
}
