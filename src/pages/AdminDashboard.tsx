import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { AuthState, SiteSettings, Content, Official, Sponsor } from '@/types'
import { defaultSiteSettings, defaultContent, defaultOfficials, defaultSponsors } from '@/lib/defaults'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { SignOut, Gear, FileText, Users, Star, Info } from '@phosphor-icons/react'

export function AdminDashboard() {
  const [auth, setAuth] = useKV<AuthState>('auth-state', { isAuthenticated: false })
  const [settings, setSettings] = useKV<SiteSettings>('site-settings', defaultSiteSettings)
  const [content, setContent] = useKV<Content>('content', defaultContent)
  const [officials, setOfficials] = useKV<Official[]>('officials', defaultOfficials)
  const [sponsors, setSponsors] = useKV<Sponsor[]>('sponsors', defaultSponsors)
  
  const navigate = useNavigate()

  if (!auth?.isAuthenticated) {
    navigate('/admin')
    return null
  }

  const handleLogout = () => {
    setAuth({ isAuthenticated: false })
    toast.success('Logged out successfully')
    navigate('/admin')
  }

  const saveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  const saveContent = () => {
    toast.success('Content saved successfully!')
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
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
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
          </TabsList>

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
                    <Label htmlFor="siteId" className="text-base font-semibold">Play-Cricket Site ID</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Your club's unique ID from the Play-Cricket URL (e.g., if your URL is play-cricket.com/website/12345, enter "12345")
                    </p>
                    <Input
                      id="siteId"
                      placeholder="e.g., 12345"
                      value={settings?.playCricketSiteId || ''}
                      onChange={(e) => setSettings((prev) => ({...prev!, playCricketSiteId: e.target.value}))}
                      className="mt-2"
                    />
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
        </Tabs>
      </div>
    </div>
  )
}
