import { AddressDto } from "@/lib/types"

const BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/addresses`

export async function getAddresses(token: string): Promise<AddressDto[]> {
    const res = await fetch(`${BASE}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to fetch addresses")
    }

    const response = await res.json()
    return response.data
}

export async function addAddress(dto: AddressDto, token: string): Promise<AddressDto> {
    const res = await fetch(`${BASE}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to add address")
    }

    const response = await res.json()
    return response.data
}

export async function updateAddress(addressId: number, dto: AddressDto, token: string): Promise<AddressDto> {
    const res = await fetch(`${BASE}/${addressId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to update address")
    }

    const response = await res.json()
    return response.data
}

export async function deleteAddress(addressId: number, token: string): Promise<void> {
    const res = await fetch(`${BASE}/${addressId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to delete address")
    }
}

export async function setDefaultShipping(addressId: number, token: string): Promise<AddressDto> {
    const res = await fetch(`${BASE}/defaultShipping/${addressId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to set default shipping address")
    }

    const response = await res.json()
    return response.data
}

export async function setDefaultBilling(addressId: number, token: string): Promise<AddressDto> {
    const res = await fetch(`${BASE}/defaultBilling/${addressId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to set default billing address")
    }

    const response = await res.json()
    return response.data
}
