'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { placeGuestOrder } from '@/lib/api/order'
import { PlaceGuestOrderRequest, AddressDto, Product } from '@/lib/types'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addressSchema } from '@/lib/schemas'

const guestCheckoutSchema = z.object({
    guestEmail: z.string().email('Invalid email'),
    shippingAddress: addressSchema,
    billingAddress: addressSchema
})

type GuestFormValues = z.infer<typeof guestCheckoutSchema>

export default function GuestCheckoutPage() {
    const router = useRouter()
    const cart = useCartStore((state) => state.cart)
    const clearCartLocal = useCartStore(state => state.clearCart)
    const [sameAsShipping, setSameAsShipping] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        watch
    } = useForm<GuestFormValues>({
        resolver: zodResolver(guestCheckoutSchema),
        defaultValues: {
            guestEmail: '',
            shippingAddress: {
                recipientName: '',
                street: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
                phone: '',
            },
            billingAddress: {
                recipientName: '',
                street: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
                phone: '',
            },
        }
    })

    const shipping = watch('shippingAddress')

    useEffect(() => {
        if (cart.length === 0) {
            router.replace('/')
        }
    }, [cart, router])

    useEffect(() => {
        if (sameAsShipping) {
            setValue('billingAddress', shipping)
        }
    }, [sameAsShipping, shipping, setValue])

    const onSubmit = async (data: GuestFormValues) => {
        setIsLoading(true)
        const items = cart.map(item => ({
            quantity: item.quantity || 1,
            unitPrice: item.price,
            totalPrice: item.price * (item.quantity || 1),
            product: {
                id: item.id,
                name: item.name,
                price: item.price,
                description: item.description,
                inventory: item.inventory,
                images: [item.image],
                category: item.category,
            } as Product,
        }))

        const request: PlaceGuestOrderRequest = {
            guestEmail: data.guestEmail,
            shippingAddress: {
                ...data.shippingAddress,
                defaultShipping: data.shippingAddress.defaultShipping ?? false,
                defaultBilling: data.shippingAddress.defaultBilling ?? false,
            },
            billingAddress: {
                ...data.billingAddress,
                defaultShipping: data.billingAddress.defaultShipping ?? false,
                defaultBilling: data.billingAddress.defaultBilling ?? false,
            },
            items
        }

        try {
            const placedOrder = await placeGuestOrder(request)
            toast.success('Order placed successfully!')
            clearCartLocal()
            console.log('Redirecting to success page with:', placedOrder.id, placedOrder.guestEmail)
            if (placedOrder.id && placedOrder.guestEmail) {
                window.location.href = `/checkout/guest/success?orderId=${placedOrder.id}&email=${encodeURIComponent(placedOrder.guestEmail)}`
            } else {
                toast.error('Missing order information for redirect')
            }
        } catch (err: any) {
            toast.error(err.message || 'Order failed')
        } finally {
            setIsLoading(false)
        }
    }

    type AddressField =
        | 'recipientName'
        | 'street'
        | 'city'
        | 'state'
        | 'zipcode'
        | 'country'
        | 'phone'

    type FieldKey =
        | `shippingAddress.${AddressField}`
        | `billingAddress.${AddressField}`

    const renderAddressFields = (
        prefix: 'shippingAddress' | 'billingAddress',
        disabled = false
    ) => {
        const fields: { name: AddressField; label: string }[] = [
            { name: 'recipientName', label: 'Name' },
            { name: 'street', label: 'Street' },
            { name: 'city', label: 'City' },
            { name: 'state', label: 'State' },
            { name: 'zipcode', label: 'Zip Code' },
            { name: 'country', label: 'Country' },
            { name: 'phone', label: 'Phone' }
        ]

        return (
            <div className="space-y-2">
                <h3 className="font-bold">
                    {prefix === 'shippingAddress' ? 'Shipping Address' : 'Billing Address'}
                </h3>
                {fields.map(({ name, label }) => (
                    <div key={`${prefix}.${name}`} className="space-y-1">
                        <Label htmlFor={`${prefix}.${name}`}>{label}</Label>
                        <Input
                            id={`${prefix}.${name}`}
                            disabled={disabled}
                            {...register(`${prefix}.${name}` as FieldKey)}
                            placeholder={label}
                        />
                        {errors?.[prefix]?.[name] && (
                            <p className="text-sm text-red-500">
                                {errors[prefix]?.[name]?.message?.toString()}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Guest Checkout</h2>

                <div className="space-y-1">
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input id="guestEmail" type="email" placeholder="Email" {...register('guestEmail')} />
                    {errors.guestEmail && (
                        <p className="text-sm text-red-500">{errors.guestEmail.message}</p>
                    )}
                </div>

                {renderAddressFields('shippingAddress')}

                <div className="flex items-center gap-2 pt-4">
                    <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={(val) => setSameAsShipping(!!val)}
                    />
                    <Label htmlFor="sameAsShipping" className="text-sm text-gray-700">
                        Same as shipping address
                    </Label>
                </div>

                {renderAddressFields('billingAddress', sameAsShipping)}

                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/cart')}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" fill="none" />
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            'Submit Order'
                        )}
                    </Button>
                </div>

            </div>

            <div className="border p-6 rounded-md space-y-4">
                <h3 className="text-xl font-semibold">Your Cart</h3>
                {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b">
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/images/image/download/${item.image.id}`}
                            alt={item.name}
                            className="w-20 h-20 rounded-md object-cover border"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                ))}
                <hr />
                <p className="font-bold text-right">
                    Total: $
                    {cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)}
                </p>
            </div>
        </form>
    )
}
