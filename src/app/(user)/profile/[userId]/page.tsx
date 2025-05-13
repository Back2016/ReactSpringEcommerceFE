'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { refreshAccessToken } from '@/lib/api/auth'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { User, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
    // This is used to prevent hydration errors
    // Other wise the user will see the login page before the page is hydrated
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => {
        setHydrated(true)
    }, [])

    const router = useRouter()
    const { userId } = useParams()
    const {
        isAuthenticated,
        user,
        isAccessTokenExpired,
        getUser,
        login,
        logout,
        getAccessToken,
    } = useAuthStore()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const validateAndRefresh = async () => {
            if (!hydrated) return;

            // Not logged in or wrong profile page
            if (!isAuthenticated) {
                router.push('/login')
                return
            }

            // If not the same user, redirect to the correct profile page
            if (user?.id?.toString() !== userId) {
                router.push(`/profile/${user?.id}`)
                return
            }

            // If access token is expired, refresh it
            if (isAccessTokenExpired()) {
                try {
                    const { accessToken } = await refreshAccessToken()
                    const currentUser = getUser()
                    if (currentUser) {
                        login(accessToken, currentUser)
                        toast.success('Access token refreshed')
                    } else {
                        logout()
                        router.push('/')
                    }
                } catch (err) {
                    toast.error('Session expired. Please log in again.')
                    logout()
                    router.push('/')
                }
            }

            setLoading(false)
        }

        validateAndRefresh()
    }, [isAuthenticated, userId, hydrated])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    // const handleTryRefresh = async () => {
    //     try {
    //         const { accessToken } = await refreshAccessToken()
    //         console.log(accessToken)
    //         const currentUser = getUser()
    //     } catch (err) {
    //         toast.error('Failed to refresh access token')
    //     }
    // }

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Your Profile</h1>
                        <p className="text-muted-foreground">Manage your account information</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">First Name</label>
                            <p className="text-lg font-medium">{user?.firstName}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                            <p className="text-lg font-medium">{user?.lastName}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                        </label>
                        <p className="text-lg font-medium">{user?.email}</p>
                    </div>
                </div>
            </Card>
            {/* <Button onClick={handleTryRefresh}>Try Refresh</Button> */}
        </div>
    )
}
