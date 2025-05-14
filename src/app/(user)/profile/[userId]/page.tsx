'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { updateUser } from '@/lib/api/user'
import { withValidToken } from '@/lib/api/auth'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { User, Mail, Loader2, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ProfilePage() {
    const [hydrated, setHydrated] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: ''
    })
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    const router = useRouter()
    const { userId } = useParams()
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const user = useAuthStore(state => state.user)
    const isAccessTokenExpired = useAuthStore(state => state.isAccessTokenExpired)
    const getUser = useAuthStore(state => state.getUser)
    const logout = useAuthStore(state => state.logout)
    const setToken = useAuthStore(state => state.setToken)
    const updateNames = useAuthStore(state => state.updateNames)
    const getAccessToken = useAuthStore(state => state.getAccessToken)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const validateAndRefresh = async () => {
            if (!hydrated) return

            if (!isAuthenticated) {
                router.push('/login')
                return
            }

            if (user?.id?.toString() !== userId) {
                router.push(`/profile/${user?.id}`)
                return
            }

            try {
                await withValidToken(
                    async () => Promise.resolve(),
                    { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
                )
            } catch (err) {
                toast.error('Session expired. Please log in again.')
                logout()
                router.push('/')
            }

            setLoading(false)
        }

        validateAndRefresh()
    }, [isAuthenticated, userId, hydrated])

    const handleEditClick = () => {
        setEditForm({
            firstName: user?.firstName || '',
            lastName: user?.lastName || ''
        })
        setIsEditing(true)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditForm({
            firstName: '',
            lastName: ''
        })
    }

    const handleSubmitUpdate = async () => {
        if (!userId) return

        setIsUpdating(true)
        try {
            const updatedUserRes = await withValidToken(
                async (token) => {
                    const response = await updateUser(userId.toString(), editForm)
                    return response
                },
                { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
            )
            if (updatedUserRes) {
                toast.success('Profile updated successfully')
                setIsEditing(false)
                updateNames(updatedUserRes.firstName, updatedUserRes.lastName)
                router.refresh()
            }
        } catch (error) {
            toast.error(`Failed to update profile: ${error}`)
        } finally {
            setIsUpdating(false)
        }
    }

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

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Your Profile</h1>
                            <p className="text-muted-foreground">Manage your account information</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditClick}
                            className="gap-2"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSubmitUpdate}
                                disabled={isUpdating}
                                className="gap-2"
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">First Name</label>
                            {isEditing ? (
                                <Input
                                    value={editForm.firstName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                                    placeholder="Enter first name"
                                />
                            ) : (
                                <p className="text-lg font-medium">{user?.firstName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                            {isEditing ? (
                                <Input
                                    value={editForm.lastName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                                    placeholder="Enter last name"
                                />
                            ) : (
                                <p className="text-lg font-medium">{user?.lastName}</p>
                            )}
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
        </div>
    )
}
