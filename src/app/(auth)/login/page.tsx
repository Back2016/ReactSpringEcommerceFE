'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api/auth'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/useAuthStore'

export default function LoginPage() {
  const loginLocally = useAuthStore(state => state.login)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateAllFields = () => {
    const newErrors = {
      email: '',
      password: '',
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const validationErrors = validateAllFields()
    const hasErrors = Object.values(validationErrors).some(err => err)

    if (hasErrors) {
      setIsLoading(false)
      toast.error('Please correct the highlighted errors.')
      return
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      })

      if (response) {
        loginLocally(response.accessToken, {
          id: response.userId,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
        })
        toast.success('Login successful!')
        router.push('/')
      }
    } catch (error) {
      toast.error('Login failed. Please check your email and password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-500">Enter your email and password to login</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="m@example.com"
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </div>
  )
}
