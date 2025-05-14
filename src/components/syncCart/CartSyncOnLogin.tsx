'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useCartStore } from '@/store/useCartStore'
import { getCart, syncCart } from '@/lib/api/cart'
import { refreshAccessToken } from '@/lib/api/auth'
import toast from 'react-hot-toast'
import { SyncCartRequest } from '@/lib/types'

export function CartSyncOnLogin() {
    const [hydrated, setHydrated] = useState(false)

    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const getAccessToken = useAuthStore(state => state.getAccessToken)
    const getUserId = useAuthStore(state => state.getUserId)
    const isAccessTokenExpired = useAuthStore(state => state.isAccessTokenExpired)
    const login = useAuthStore(state => state.login)
    const logout = useAuthStore(state => state.logout)
    const getUser = useAuthStore(state => state.getUser)

    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)
    const setCart = useCartStore(state => state.setCart)
    const hasSyncedOnce = useCartStore(state => state.hasSyncedOnce)
    const markSynced = useCartStore(state => state.markSynced)


    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        // console.log('Sync Effect triggered:', {
        //     hydrated,
        //     isAuthenticated,
        //     cartLength: cart.length,
        //     hasSyncedOnce
        // })


        const performSync = async () => {
            if (!hydrated || hasSyncedOnce || !isAuthenticated) return

            // console.log('Syncing cart...')

            let token = getAccessToken()
            const userId = getUserId()
            if (!token || !userId) return

            try {
                if (isAccessTokenExpired()) {
                    const { accessToken } = await refreshAccessToken()
                    const currentUser = getUser()
                    if (currentUser) {
                        login(accessToken, currentUser)
                        token = accessToken
                        toast.success('Access token refreshed')
                    } else {
                        logout()
                        return
                    }
                }

                let mergedCart

                if (cart.length > 0) {
                    const syncItems: SyncCartRequest[] = cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                    }))
                    mergedCart = await syncCart(userId.toString(), token, syncItems)
                    toast.success('Local cart merged with server')
                } else {
                    mergedCart = await getCart(userId.toString(), token)
                    toast.success('Loaded server cart')
                }

                clearCart()
                setCart(mergedCart.items.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    description: item.product.description,
                    price: item.unitPrice,
                    inventory: item.product.inventory,
                    image: item.product.images[0],
                    category: item.product.category,
                    quantity: item.quantity,
                })))

                markSynced()
                toast.success('Cart synced with your account')
            } catch (err) {
                toast.error('Failed to sync cart')
                console.error(err)
            }
        }

        performSync()
    }, [hydrated, isAuthenticated, cart, hasSyncedOnce])

    return null
}
