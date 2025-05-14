import { CartResponse, SyncCartRequest } from "../types"

export async function getCart(userId: string, token: string): Promise<CartResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/carts/user/${userId}/cart`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to fetch cart")
    }

    const response = await res.json()
    return response.data
}

export async function syncCart(userId: string, token: string, SyncCartRequests: SyncCartRequest[]): Promise<CartResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/carts/user/${userId}/syncCart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items: SyncCartRequests }),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to sync cart")
    }

    const response = await res.json()
    return response.data
}

export async function addItemToCart(productId: number, quantity: number, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cartItems/cartItem/add?productId=${productId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to add item to cart')
    }

    return res.json()
}

export async function updateCartItem(productId: number, quantity: number, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cartItems/cart/update/item/${productId}?quantity=${quantity}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update cart item')
    }

    return res.json()
}

export async function removeItemFromCart(productId: number, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cartItems/cart/delete/item/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to remove item from cart')
    }

    return res.json()
}

export async function clearCart(token: string): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/carts/user/clearCart`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to clear cart')
    }
}
