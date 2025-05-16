import { Order, OrderStatus } from '@/lib/types'
import { PlaceOrderRequest, PaginatedResponse } from '@/lib/types'

const BASE_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orders`

export async function getUserOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${BASE_API}/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch orders')
  }

  const response = await res.json()
  return response.data
}

export async function placeOrder(request: PlaceOrderRequest, token: string): Promise<Order> {
  const res = await fetch(`${BASE_API}/user/placeOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(request)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to place order')
  }

  const response = await res.json()
  return response.data
}


export async function getAdminOrders(status: string, page = 0, size = 10, token: string): Promise<PaginatedResponse<Order>> {
  const res = await fetch(`${BASE_API}/admin?status=${status}&page=${page}&size=${size}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch admin orders')
  }

  const response = await res.json()
  return response.data
}

export async function updateOrderStatus(orderId: number, status: OrderStatus, token: string): Promise<Order> {
  const res = await fetch(`${BASE_API}/admin/${orderId}/status?status=${status}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to update order status')
  }

  const response = await res.json()
  return response.data
}
