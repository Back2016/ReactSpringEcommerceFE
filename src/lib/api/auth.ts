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

export async function login(data: LoginRequest): Promise<LoginResponse> {
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
        const error = await response.json()
        throw new Error(error.message || 'Logout failed')
    }

    return response.json()
}

interface RefreshResponse {
    accessToken: string
}

export async function refreshAccessToken(): Promise<RefreshResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include', // include cookies for refresh token
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Failed to refresh access token')
    }

    return response.json()
}
