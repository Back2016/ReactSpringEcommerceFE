import { UserDto } from '@/lib/types'

const BASE_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users`

interface UserUpdateRequest {
    firstName?: string
    lastName?: string
}

export const updateUser = async (userId: string, request: UserUpdateRequest) => {
    const res = await fetch(`${BASE_API}/${userId}/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to update user')
    }

    const response = await res.json();


    return response.data;
}




export async function getUserById(userId: number, token: string): Promise<UserDto> {
  const res = await fetch(`${BASE_API}/user/${userId}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch user by ID')
  }

  const response = await res.json()
  return response.data
}
