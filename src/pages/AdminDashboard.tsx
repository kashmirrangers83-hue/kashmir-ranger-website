import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { SiteSettings, Content, Official, Sponsor } from '@/types'
import { defaultSiteSettings, defaultContent, defaultOfficials, defaultSponsors } from '@/lib/defaults'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { SignOut, Gear, FileText, Users, Star, Info, Image as ImageIcon, Plus, Trash, DotsSixVertical, House, UploadSimple } from '@phosphor-icons/react'

interface GalleryPhoto {
  id: string
  url: string
  caption?: string
  uploadedAt: number
}

interface HeroSettings {
  backgroundImage: string
  title: string
  subtitle: string
}

export function AdminDashboard() {
  const [settings, setSettings] = useKV<SiteSettings>('site-settings', defaultSiteSettings)
  const [content, setContent] = useKV<Content>('content', defaultContent)
  const [officials, setOfficials] = useKV<Official[]>('officials', defaultOfficials)
  const [sponsors, setSponsors] = useKV<Sponsor[]>('sponsors', defaultSponsors)
  const [photos, setPhotos] = useKV<GalleryPhoto[]>('gallery-photos', [])
  const [heroSettings, setHeroSettings] = useKV<HeroSettings>('hero-settings', {
    backgroundImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600',
    title: '',
    subtitle: 'The Ranger Standard: Excellence, Teamwork, Legacy'
  })
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [newPhotoCaption, setNewPhotoCaption] = useState('')
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await window.spark.user()
      if (user && user.isOwner) {
        setIsAuthenticated(true)
      } else {
        navigate('/admin')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      navigate('/admin')
    } finally {
      setIsCheckingAuth(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    toast.success('Logged out successfully')
    navigate('/admin')
  }

  const saveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  const saveContent = () => {
    toast.success('Content saved successfully!')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAddPhoto = async () => {
    let photoUrl = ''

    if (uploadMethod === 'file') {
      if (!selectedFile || !previewUrl) {
        toast.error('Please select a photo to upload')
        return
      }
      photoUrl = previewUrl
    } else {
      if (!newPhotoUrl.trim()) {
        toast.error('Please enter a photo URL')
        return
      }
      photoUrl = newPhotoUrl
    }

    const newPhoto: GalleryPhoto = {
      id: Date.now().toString(),
      url: photoUrl,
      caption: newPhotoCaption || undefined,
      uploadedAt: Date.now()
    }

    setPhotos((currentPhotos) => [...(currentPhotos || []), newPhoto])
    
    setNewPhotoUrl('')
    setNewPhotoCaption('')
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsAddPhotoOpen(false)
    toast.success('Photo added to gallery!')
  }

  const handleDeletePhoto = (id: string) => {
    setPhotos((currentPhotos) => (currentPhotos || []).filter(photo => photo.id !== id))
    toast.success('Photo removed from gallery')
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    setPhotos((currentPhotos) => {
      const photosCopy = [...(currentPhotos || [])]
      const draggedPhoto = photosCopy[draggedIndex]
      photosCopy.splice(draggedIndex, 1)
      photosCopy.splice(dragOverIndex, 0, draggedPhoto)
      return photosCopy
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
    toast.success('Photo order updated')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Independence - Admin Panel</h1>
          <Button variant="secondary" onClick={handleLogout} className="gap-2">
            <SignOut size={20} weight="bold" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="homepage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 max-w-5xl">
            <TabsTrigger value="homepage" className="gap-2">
              <House size={20} />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Gear size={20} />
              Settings
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText size={20} />
              Content
            </TabsTrigger>
            <TabsTrigger value="officials" className="gap-2">
              <Users size={20} />
              Officials
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="gap-2">
              <Star size={20} />
              Sponsors
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <ImageIcon size={20} />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homepage">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase tracking-wide">Homepage Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 bg-primary/5 rounded-md border border-primary/20">
                  <h3 className="font-semibold text-lg text-primary">Hero Section</h3>
                  
                  <div>
                    <Label htmlFor="heroBackground" className="text-base font-semibold">Background Image URL</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Enter the URL of the hero background image (recommended: 1600px wide)
                    </p>
                    <Input
                      id="heroBackground"
                      placeholder="https://example.com/hero-image.jpg"
                      value={heroSettings?.backgroundImage || ''}
                      onChange={(e) => setHeroSettings((prev) => ({...prev!, backgroundImage: e.target.value}))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="heroTitle" className="text-base font-semibold">Hero Title</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Leave empty to use club name from settings
                    </p>
                    <Input
                      id="heroTitle"
                      placeholder="Kashmir Rangers Cricket Club"
                      value={heroSettings?.title || ''}
                      onChange={(e) => setHeroSettings((prev) => ({...prev!, title: e.target.value}))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="heroSubtitle" className="text-base font-semibold">Hero Subtitle</Label>
                    <Input
                      id="heroSubtitle"
                      placeholder="The Ranger Standard: Excellence, Teamwork, Legacy"
                      value={heroSettings?.subtitle || ''}
                      onChange={(e) => setHeroSettings((prev) => ({...prev!, subtitle: e.target.value}))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button onClick={() => toast.success('Homepage settings saved!')} className="w-full uppercase tracking-wide font-semibold">
                  Save Homepage Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase tracking-wide">Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="clubName" className="text-base font-semibold">Club Name</Label>
                  <Input
                    id="clubName"
                    value={settings?.clubName || ''}
                    onChange={(e) => setSettings((prev) => ({...prev!, clubName: e.target.value}))}
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings?.socialMedia.email || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, socialMedia: {...prev!.socialMedia, email: e.target.value}}))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold">Phone</Label>
                    <Input
                      id="phone"
                      value={settings?.socialMedia.phone || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, socialMedia: {...prev!.socialMedia, phone: e.target.value}}))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="twitter" className="text-base font-semibold">Twitter URL</Label>
                    <Input
                      id="twitter"
                      value={settings?.socialMedia.twitter || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, socialMedia: {...prev!.socialMedia, twitter: e.target.value}}))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook" className="text-base font-semibold">Facebook URL</Label>
                    <Input
                      id="facebook"
                      value={settings?.socialMedia.facebook || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, socialMedia: {...prev!.socialMedia, facebook: e.target.value}}))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram" className="text-base font-semibold">Instagram URL</Label>
                    <Input
                      id="instagram"
                      value={settings?.socialMedia.instagram || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, socialMedia: {...prev!.socialMedia, instagram: e.target.value}}))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-6 p-6 bg-muted/30 rounded-lg border-2 border-primary/10">
                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-md border border-primary/20">
                    <Info size={24} className="text-primary mt-0.5 flex-shrink-0" weight="bold" />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary text-base">How to Get Play-Cricket Widget Codes</h3>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Visit your club page at <a href="https://www.play-cricket.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">play-cricket.com</a></li>
                        <li>Navigate to the section you want to display (League Table or Results)</li>
                        <li>Look for the "Share" or "Embed" option on that page</li>
                        <li>Copy the entire embed code (including the <code className="bg-muted px-1 rounded">&lt;iframe&gt;</code> tags)</li>
                        <li>Paste the code into the appropriate field below</li>
                      </ol>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="siteId" className="text-base font-semibold">Play-Cricket Club URL</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Your club's Play-Cricket URL (e.g., <code className="bg-muted px-1 rounded">https://kashmirrangers.play-cricket.com</code>)
                    </p>
                    <Input
                      id="siteId"
                      placeholder="https://yourclub.play-cricket.com"
                      value={settings?.playCricketSiteId || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, playCricketSiteId: e.target.value}))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="teamId" className="text-base font-semibold">Play-Cricket Team ID</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      The number from your team page URL (e.g., if URL is <code className="bg-muted px-1 rounded">/Teams/385051</code>, enter <code className="bg-muted px-1 rounded">385051</code>)
                    </p>
                    <Input
                      id="teamId"
                      placeholder="e.g., 385051"
                      value={settings?.playCricketTeamId || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, playCricketTeamId: e.target.value}))}
                      className="mt-2"
                    />
                  </div>

                  <div className="p-4 bg-primary/5 rounded-md border border-primary/20 space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary text-sm">🔴 Live Data via Play-Cricket API (optional)</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get an API token from <a href="https://play-cricket.com/api_access" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">play-cricket.com/api_access</a> to show live fixtures and results directly on the Scores page.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="numericSiteId" className="text-sm font-semibold">Numeric Site ID</Label>
                      <p className="text-xs text-muted-foreground mt-1 mb-1">Found in Play-Cricket admin or from <code className="bg-muted px-1 rounded">play-cricket.com/api/v2/site_info.json?api_token=TOKEN&domain=yourclub.play-cricket.com</code></p>
                      <Input
                        id="numericSiteId"
                        placeholder="e.g., 12345"
                        value={settings?.playCricketNumericSiteId || ''}
                        onChange={(e) => setSettings((prev) => ({...prev!, playCricketNumericSiteId: e.target.value}))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apiToken" className="text-sm font-semibold">API Token</Label>
                      <Input
                        id="apiToken"
                        type="password"
                        placeholder="Paste your Play-Cricket API token"
                        value={settings?.playCricketApiToken || ''}
                        onChange={(e) => setSettings((prev) => ({...prev!, playCricketApiToken: e.target.value}))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="leagueWidget" className="text-base font-semibold">League Table Widget Code</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Paste the complete embed/iframe code from Play-Cricket for your league table
                    </p>
                    <Textarea
                      id="leagueWidget"
                      placeholder='<iframe src="..." width="100%" height="400"></iframe>'
                      value={settings?.playCricketLeagueTableWidget || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, playCricketLeagueTableWidget: e.target.value}))}
                      rows={4}
                      className="mt-2 font-mono text-xs"
                    />
                    {settings?.playCricketLeagueTableWidget && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-success">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        Widget code detected - will display on Scores page
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="resultsWidget" className="text-base font-semibold">Results Widget Code</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Paste the complete embed/iframe code from Play-Cricket for your recent results
                    </p>
                    <Textarea
                      id="resultsWidget"
                      placeholder='<iframe src="..." width="100%" height="400"></iframe>'
                      value={settings?.playCricketResultsWidget || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, playCricketResultsWidget: e.target.value}))}
                      rows={4}
                      className="mt-2 font-mono text-xs"
                    />
                    {settings?.playCricketResultsWidget && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-success">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        Widget code detected - will display on Scores page
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fixturesWidget" className="text-base font-semibold">Fixtures Widget Code</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Paste the complete embed/iframe code from Play-Cricket for your upcoming fixtures
                    </p>
                    <Textarea
                      id="fixturesWidget"
                      placeholder='<iframe src="..." width="100%" height="400"></iframe>'
                      value={settings?.playCricketFixturesWidget || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, playCricketFixturesWidget: e.target.value}))}
                      rows={4}
                      className="mt-2 font-mono text-xs"
                    />
                    {settings?.playCricketFixturesWidget && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-success">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        Widget code detected - will display on Scores page
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={saveSettings} className="w-full uppercase tracking-wide font-semibold">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase tracking-wide">Content Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="homeAnnouncement" className="text-base font-semibold">Home Page Announcement</Label>
                  <Textarea
                    id="homeAnnouncement"
                    value={content?.homeAnnouncement || ''}
                    onChange={(e) => setContent((prev) => ({...prev!, homeAnnouncement: e.target.value}))}
                    rows={2}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="rangerStandard" className="text-base font-semibold">Ranger Standard Philosophy</Label>
                  <Textarea
                    id="rangerStandard"
                    value={content?.rangerStandard || ''}
                    onChange={(e) => setContent((prev) => ({...prev!, rangerStandard: e.target.value}))}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="aboutPage" className="text-base font-semibold">About Page Content</Label>
                  <Textarea
                    id="aboutPage"
                    value={content?.aboutPage || ''}
                    onChange={(e) => setContent((prev) => ({...prev!, aboutPage: e.target.value}))}
                    rows={12}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-4 p-4 bg-muted/50 rounded-md">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  <div>
                    <Label htmlFor="address" className="text-base font-semibold">Address</Label>
                    <Input
                      id="address"
                      value={content?.contactInfo.address || ''}
                      onChange={(e) => setContent((prev) => ({...prev!, contactInfo: {...prev!.contactInfo, address: e.target.value}}))}
                      className="mt-2"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail" className="text-base font-semibold">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={content?.contactInfo.email || ''}
                        onChange={(e) => setContent((prev) => ({...prev!, contactInfo: {...prev!.contactInfo, email: e.target.value}}))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone" className="text-base font-semibold">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={content?.contactInfo.phone || ''}
                        onChange={(e) => setContent((prev) => ({...prev!, contactInfo: {...prev!.contactInfo, phone: e.target.value}}))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={saveContent} className="w-full uppercase tracking-wide font-semibold">
                  Save Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="officials">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase tracking-wide">Officials Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Currently displaying {officials?.length || 0} officials. Use the form below to update official information.
                </p>
                <div className="space-y-4">
                  {officials?.map((official, index) => (
                    <div key={official.id} className="p-4 border rounded-md space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold">Name</Label>
                          <Input
                            value={official.name}
                            onChange={(e) => {
                              const updated = [...(officials || [])]
                              updated[index] = {...updated[index], name: e.target.value}
                              setOfficials(updated)
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Role</Label>
                          <Input
                            value={official.role}
                            onChange={(e) => {
                              const updated = [...(officials || [])]
                              updated[index] = {...updated[index], role: e.target.value}
                              setOfficials(updated)
                            }}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => toast.success('Officials updated!')} className="w-full mt-6 uppercase tracking-wide font-semibold">
                  Save Officials
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase tracking-wide">Sponsors Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Currently displaying {sponsors?.length || 0} sponsors. Use the form below to update sponsor information.
                </p>
                <div className="space-y-4">
                  {sponsors?.map((sponsor, index) => (
                    <div key={sponsor.id} className="p-4 border rounded-md space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold">Sponsor Name</Label>
                          <Input
                            value={sponsor.name}
                            onChange={(e) => {
                              const updated = [...(sponsors || [])]
                              updated[index] = {...updated[index], name: e.target.value}
                              setSponsors(updated)
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Website URL</Label>
                          <Input
                            value={sponsor.websiteUrl || ''}
                            onChange={(e) => {
                              const updated = [...(sponsors || [])]
                              updated[index] = {...updated[index], websiteUrl: e.target.value}
                              setSponsors(updated)
                            }}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => toast.success('Sponsors updated!')} className="w-full mt-6 uppercase tracking-wide font-semibold">
                  Save Sponsors
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase tracking-wide flex justify-between items-center">
                  <span>Gallery Manager</span>
                  <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus size={20} weight="bold" />
                        Add Photo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Add Photo to Gallery</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        <RadioGroup value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'file' | 'url')} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="file" id="file" />
                            <Label htmlFor="file" className="cursor-pointer font-medium">Upload Photo</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="url" id="url" />
                            <Label htmlFor="url" className="cursor-pointer font-medium">Use Image URL</Label>
                          </div>
                        </RadioGroup>

                        {uploadMethod === 'file' ? (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="photoFile" className="text-base font-semibold">Select Photo</Label>
                              <p className="text-sm text-muted-foreground mb-3">
                                Choose an image file from your device (max 5MB)
                              </p>
                              <div className="relative">
                                <Input
                                  id="photoFile"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="cursor-pointer"
                                />
                              </div>
                            </div>
                            {previewUrl && (
                              <div className="border-2 border-primary/20 rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-full h-64 object-cover"
                                />
                                <div className="p-2 bg-primary/5 text-center">
                                  <p className="text-sm text-muted-foreground">Preview</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor="photoUrl" className="text-base font-semibold">Photo URL</Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Enter the URL of the image you want to add to the gallery
                            </p>
                            <Input
                              id="photoUrl"
                              placeholder="https://example.com/photo.jpg"
                              value={newPhotoUrl}
                              onChange={(e) => setNewPhotoUrl(e.target.value)}
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="photoCaption" className="text-base font-semibold">Caption (Optional)</Label>
                          <Input
                            id="photoCaption"
                            placeholder="Match vs XYZ Cricket Club"
                            value={newPhotoCaption}
                            onChange={(e) => setNewPhotoCaption(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleAddPhoto} className="w-full uppercase tracking-wide font-semibold">
                          Add to Gallery
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(!photos || photos.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <ImageIcon size={48} weight="light" className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Photos Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Click "Add Photo" above to start building your gallery
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-6">
                      Currently displaying {photos.length} photo{photos.length !== 1 ? 's' : ''} in the gallery. Drag and drop to reorder.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {photos.map((photo, index) => (
                        <Card 
                          key={photo.id} 
                          className={`overflow-hidden cursor-move transition-all duration-200 ${
                            draggedIndex === index ? 'opacity-50 scale-95' : ''
                          } ${
                            dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-primary' : ''
                          }`}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                        >
                          <div className="aspect-square relative overflow-hidden bg-muted">
                            <div className="absolute top-2 left-2 z-10 bg-background/90 backdrop-blur-sm rounded-md p-1.5 shadow-md">
                              <DotsSixVertical size={20} weight="bold" className="text-muted-foreground" />
                            </div>
                            <img
                              src={photo.url}
                              alt={photo.caption || 'Gallery photo'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            {photo.caption && (
                              <p className="text-sm mb-3">{photo.caption}</p>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="w-full gap-2"
                            >
                              <Trash size={16} weight="bold" />
                              Remove Photo
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
