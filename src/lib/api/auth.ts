import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface RegisterResponse {
    id: number
    firstName: string
    lastName: string
    email: string
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
    }

    return response.json()
}

interface LoginRequest {
    email: string
    password: string
}

interface LoginResponse {
    accessToken: string
    userId: number
    firstName: string
    lastName: string
    email: string
}

export interface AuthResponse {
    firstName: string;
    lastName: string;
    accessToken: string;
    role: string;
    userId: number;
    email: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
    }

    // This is the json access token
    return response.json()
}

export async function logout() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
    })

    if (!response.ok) {
        throw new Error('Logout failed')
    }

    // Read the response text
    const text = await response.text()
    return text
}

interface RefreshResponse {
    accessToken: string
}

export async function refreshAccessToken(): Promise<RefreshResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include'
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Failed to refresh access token')
    }

    return response.json()
}

export const withValidToken = async <T,>(
    apiCall: (token: string) => Promise<T>,
    {
        getAccessToken,
        isAccessTokenExpired,
        getUser,
        setToken,
        logout,
        router
    }: {
        getAccessToken: () => string | null
        isAccessTokenExpired: () => boolean
        getUser: () => any
        setToken: (token: string) => void
        logout: () => void
        router: any
    }
): Promise<T | undefined> => {
    try {
        const token = getAccessToken()
        if (!token) return

        if (isAccessTokenExpired()) {
            const { accessToken } = await refreshAccessToken()
            const currentUser = getUser()
            if (currentUser) {
                setToken(accessToken)
                toast.success('Access token refreshed')
                return await apiCall(accessToken)
            } else {
                logout()
                router.push('/')
                return
            }
        }
        return await apiCall(token)
    } catch (err) {
        console.error('API call failed:', err)
        throw err
    }
}
