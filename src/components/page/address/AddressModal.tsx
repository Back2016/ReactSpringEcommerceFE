'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  updateAddress,
  addAddress,
  setDefaultShipping,
  setDefaultBilling,
  deleteAddress
} from '@/lib/api/address'
import { useAuthStore } from '@/store/useAuthStore'
import { AddressDto } from '@/lib/types'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { addressSchema as schema } from '@/lib/schemas'

type FormValues = z.infer<typeof schema>

interface AddressModalProps {
  mode: 'edit' | 'add'
  address?: AddressDto
  onClose: () => void
  onSuccess: (address: AddressDto) => void
  onRefresh?: () => void
}

export function AddressModal({ mode, address, onClose, onSuccess, onRefresh }: AddressModalProps) {
  const getAccessToken = useAuthStore(state => state.getAccessToken)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      recipientName: address?.recipientName || '',
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      zipcode: address?.zipcode || '',
      country: address?.country || '',
      phone: address?.phone || '',
      defaultShipping: address?.defaultShipping ?? false,
      defaultBilling: address?.defaultBilling ?? false
    }
  })

  const onSubmit = async (data: FormValues) => {
    const token = getAccessToken()
    if (!token) {
      toast.error('Missing access token')
      return
    }

    setLoading(true)
    try {
      let saved: AddressDto

      if (mode === 'edit' && address?.id) {
        saved = await updateAddress(
          address.id,
          {
            ...data,
            defaultShipping: data.defaultShipping ?? false,
            defaultBilling: data.defaultBilling ?? false
          },
          token
        )
        if (data.defaultShipping) await setDefaultShipping(address.id, token)
        if (data.defaultBilling) await setDefaultBilling(address.id, token)
        toast.success('Address updated')
      } else {
        saved = await addAddress(
          {
            ...data,
            defaultShipping: data.defaultShipping ?? false,
            defaultBilling: data.defaultBilling ?? false
          },
          token
        )
        if (saved.id) {
          if (data.defaultShipping) await setDefaultShipping(saved.id, token)
          if (data.defaultBilling) await setDefaultBilling(saved.id, token)
        }
        toast.success('Address added')
      }

      onSuccess(saved)
      if (data.defaultShipping || data.defaultBilling) {
        onRefresh?.()
      }
    } catch (err: any) {
      toast.error(err.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!address?.id) return

    const token = getAccessToken()
    if (!token) {
      toast.error('Missing access token')
      return
    }

    setLoading(true)
    try {
      await deleteAddress(address.id, token)
      toast.success('Address deleted')
      onClose()
      onRefresh?.()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete address')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {[
            { name: 'recipientName', label: 'Name' },
            { name: 'street', label: 'Street' },
            { name: 'city', label: 'City' },
            { name: 'state', label: 'State' },
            { name: 'zipcode', label: 'Zip Code' },
            { name: 'country', label: 'Country' },
            { name: 'phone', label: 'Phone' }
          ].map(({ name, label }) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} {...register(name as keyof FormValues)} placeholder={label} />
              {errors[name as keyof FormValues] && (
                <p className="text-sm text-red-500">{errors[name as keyof FormValues]?.message?.toString()}</p>
              )}
            </div>
          ))}

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultShipping"
                checked={watch('defaultShipping')}
                onCheckedChange={val => setValue('defaultShipping', val as boolean)}
              />
              <Label htmlFor="defaultShipping">Set as Default Shipping</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultBilling"
                checked={watch('defaultBilling')}
                onCheckedChange={val => setValue('defaultBilling', val as boolean)}
              />
              <Label htmlFor="defaultBilling">Set as Default Billing</Label>
            </div>
          </div>

          <div className="flex justify-between items-center gap-3 pt-4">
            {mode === 'edit' && (
              <Button
                type="button"
                className="bg-white border border-red-500 text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
              </Button>
            )}

            <div className="ml-auto flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}
