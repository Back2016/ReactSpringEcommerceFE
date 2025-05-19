import { z } from 'zod'

// AddressDto schema
export const addressSchema = z.object({
    recipientName: z.string().min(1, 'Recipient name is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipcode: z
      .string()
      .min(5, 'Zip code is required')
      .regex(/^\d+$/, 'Zip code must contain only numbers'),
    country: z.string().min(1, 'Country is required'),
    phone: z
      .string()
      .min(8, 'Phone is required and must be at least 8 digits')
      .regex(/^\d+$/, 'Phone number must contain only numbers'),
    defaultShipping: z.boolean().optional(),
    defaultBilling: z.boolean().optional()
  })

// Cart item schema
export const cartItemSchema = z.object({
    quantity: z.number().min(1),
    product: z.object({
        id: z.number()
    })
})

// Guest order schema
export const placeGuestOrderSchema = z.object({
    guestEmail: z.string().email(),
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    items: z.array(cartItemSchema).min(1)
})
