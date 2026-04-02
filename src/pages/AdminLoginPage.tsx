import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LockKey, GithubLogo } from '@phosphor-icons/react'

export function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await window.spark.user()
      setUser(currentUser)
      if (currentUser && currentUser.isOwner) {
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const currentUser = await window.spark.user()
      setUser(currentUser)
      
      if (currentUser && currentUser.isOwner) {
        toast.success('Login successful!')
        navigate('/admin/dashboard')
      } else if (currentUser && !currentUser.isOwner) {
        toast.error('Access denied: Only the owner can access the admin panel')
      } else {
        toast.error('Authentication failed')
      }
    } catch (error) {
      toast.error('Authentication error')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-deep-navy to-primary/80 p-4">
      <Card className="w-full max-w-md border-2">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <LockKey size={32} weight="bold" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-primary mb-2">
              Independence
            </h1>
            <p className="text-muted-foreground">Admin Panel Login</p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-md border border-primary/20">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Admin access is restricted to the Spark owner
              </p>
              {user && !user.isOwner && (
                <p className="text-xs text-destructive text-center">
                  Signed in as {user.login} (not owner)
                </p>
              )}
            </div>

            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full uppercase tracking-wide font-semibold gap-2"
            >
              <GithubLogo size={20} weight="fill" />
              {isLoading ? 'Authenticating...' : 'Login with GitHub'}
            </Button>

            <div className="mt-6 p-4 bg-primary/5 rounded-md border border-primary/20">
              <p className="text-xs text-muted-foreground">
                This admin panel uses secure GitHub authentication. Only the Spark owner can access admin features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
