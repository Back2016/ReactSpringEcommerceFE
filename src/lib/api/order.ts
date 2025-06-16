import { Order, OrderStatus, PlaceGuestOrderRequest } from '@/lib/types'
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

export async function getUserOrderById(orderId: number, token: string): Promise<Order> {
  const res = await fetch(`${BASE_API}/user/${orderId}`, {
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

export async function placeGuestOrder(request: PlaceGuestOrderRequest): Promise<Order> {
  const res = await fetch(`${BASE_API}/guest/placeOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to place guest order')
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

export async function getGuestOrdersByEmail(email: string): Promise<Order[]> {
  const res = await fetch(`${BASE_API}/guest?email=${encodeURIComponent(email)}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch guest orders')
  }

  const response = await res.json()
  return response.data
}

export async function getGuestOrderByIdandEmail(orderId: number, email: string): Promise<Order> {
  const res = await fetch(`${BASE_API}/guest/${orderId}?email=${encodeURIComponent(email)}`, {
    method: 'GET'
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch guest order')
  }

  const response = await res.json()
  return response.data
}

export async function createPaymentIntent(orderId: number): Promise<{ clientSecret: string }> {
  const res = await fetch(`${BASE_API}/paymentIntent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderId })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to create payment intent')
  }

  const response = await res.json()
  return response
}
