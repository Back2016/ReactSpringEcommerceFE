interface UserUpdateRequest {
    firstName?: string
    lastName?: string
}

export const updateUser = async (userId: string, request: UserUpdateRequest) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/${userId}/update`, {
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

    // console.log('Fetched products:', response);

    return response.data;
}
