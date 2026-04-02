import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { AuthState } from '@/types'
import { ADMIN_CREDENTIALS } from '@/lib/defaults'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { LockKey } from '@phosphor-icons/react'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setAuth] = useKV<AuthState>('auth-state', { isAuthenticated: false })
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setAuth({ isAuthenticated: true, email })
      toast.success('Login successful!')
      navigate('/admin/dashboard')
    } else {
      toast.error('Invalid credentials')
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-base font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
                placeholder={ADMIN_CREDENTIALS.email}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-base font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
                placeholder="Enter password"
              />
            </div>
            <Button type="submit" className="w-full uppercase tracking-wide font-semibold">
              Login
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
            <p className="text-sm font-mono">{ADMIN_CREDENTIALS.email}</p>
            <p className="text-sm font-mono">{ADMIN_CREDENTIALS.password}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
