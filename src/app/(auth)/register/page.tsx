'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/api/auth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const validateField = (name: string, value: string) => {
    const updatedErrors = { ...errors }

    switch (name) {
      case 'firstName':
        updatedErrors.firstName = value.trim() ? '' : 'First name is required'
        break
      case 'lastName':
        updatedErrors.lastName = value.trim() ? '' : 'Last name is required'
        break
      case 'email':
        updatedErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'Invalid email format'
        break
      case 'password':
        updatedErrors.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)
          ? ''
          : 'Password must be: at least 8 characters and include uppercase, lowercase, and a number'
        break
      case 'confirmPassword':
        updatedErrors.confirmPassword =
          value === formData.password ? '' : 'Passwords does not match'
        break
    }

    setErrors(updatedErrors)
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    })

    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  // Reset form when component unmounts to protect password
  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(err => err)

    if (hasErrors) {
      setIsLoading(false)
      toast.error('Please correct the highlighted errors.')
      return
    }

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })

      if (response) {
        toast.success('Registration successful!')
        router.push('/login')
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-gray-500">Enter your details to create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {['firstName', 'lastName'].map((field) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field}>
                {field === 'firstName' ? 'First Name' : 'Last Name'}
              </Label>
              <Input
                id={field}
                name={field}
                type="text"
                placeholder={field === 'firstName' ? 'John' : 'Doe'}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors[field as keyof typeof errors] && (
                <p className="text-sm text-red-500">
                  {errors[field as keyof typeof errors]}
                </p>
              )}
            </div>
          ))}
        </div>

        {['email', 'password', 'confirmPassword'].map((field) => (
          <div className="space-y-2" key={field}>
            <Label htmlFor={field}>
              {field === 'confirmPassword'
                ? 'Confirm Password'
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </Label>
            <Input
              id={field}
              name={field}
              type={field === 'email' ? 'email' : 'password'}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors[field as keyof typeof errors] && (
              <p className="text-sm text-red-500">
                {errors[field as keyof typeof errors]}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  )
}
