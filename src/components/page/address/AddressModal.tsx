'use client'

import { useState } from 'react'
import { AddressDto } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateAddress, addAddress, setDefaultShipping, setDefaultBilling } from '@/lib/api/address'
import { useAuthStore } from '@/store/useAuthStore'

interface AddressModalProps {
    mode: 'edit' | 'add'
    address?: AddressDto
    onClose: () => void
    onSuccess: (address: AddressDto) => void
    onRefresh?: () => void
}

export function AddressModal({ mode, address, onClose, onSuccess, onRefresh }: AddressModalProps) {
    const getAccessToken = useAuthStore(state => state.getAccessToken)
    const [form, setForm] = useState<AddressDto>(
        address ?? {
            recipientName: '',
            street: '',
            city: '',
            state: '',
            country: '',
            phone: '',
            defaultShipping: false,
            defaultBilling: false,
            zipcode: '',
        }
    )
    const [loading, setLoading] = useState(false)

    const handleChange = (field: keyof AddressDto, value: string | boolean) => {
        setForm(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async () => {
        const token = getAccessToken()
        if (!token) {
            toast.error('Missing access token')
            return
        }

        setLoading(true)

        try {
            let saved: AddressDto

            if (mode === 'edit' && form.id) {
                saved = await updateAddress(form.id, form, token)

                if (form.defaultShipping) {
                    await setDefaultShipping(form.id, token)
                }

                if (form.defaultBilling) {
                    await setDefaultBilling(form.id, token)
                }

                toast.success('Address updated')
            } else {
                saved = await addAddress(form, token)
                toast.success('Address added')
            }

            onSuccess(saved)

            if (form.defaultShipping || form.defaultBilling) {
                onRefresh?.()
            }
        } catch (err: any) {
            toast.error(err.message || 'Operation failed')
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'edit' ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <Input
                        value={form.recipientName}
                        onChange={e => handleChange('recipientName', e.target.value)}
                        placeholder="Recipient Name"
                    />
                    <Input
                        value={form.street}
                        onChange={e => handleChange('street', e.target.value)}
                        placeholder="Street"
                    />
                    <Input
                        value={form.city}
                        onChange={e => handleChange('city', e.target.value)}
                        placeholder="City"
                    />
                    <Input
                        value={form.state}
                        onChange={e => handleChange('state', e.target.value)}
                        placeholder="State"
                    />
                    <Input
                        value={form.zipcode}
                        onChange={e => handleChange('zipcode', e.target.value)}
                        placeholder="Zip Code"
                    />
                    <Input
                        value={form.country}
                        onChange={e => handleChange('country', e.target.value)}
                        placeholder="Country"
                    />
                    <Input
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        placeholder="Phone"
                    />
                </div>

                {mode === 'edit' && (
                    <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.defaultShipping}
                                onChange={(e) => handleChange('defaultShipping', e.target.checked)}
                            />
                            <label className="text-sm text-muted-foreground">Set as Default Shipping</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.defaultBilling}
                                onChange={(e) => handleChange('defaultBilling', e.target.checked)}
                            />
                            <label className="text-sm text-muted-foreground">Set as Default Billing</label>
                        </div>
                    </div>
                )}


                <div className="flex justify-end mt-6 gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
