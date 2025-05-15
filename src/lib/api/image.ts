import { Image } from '@/lib/types'

// Upload one or more product images
export async function uploadProductImages(
    productId: number,
    files: File[],
    token: string
): Promise<Image[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('productId', productId.toString());

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/images/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) throw new Error(`Failed to upload images: ${res.status}`);

    const response = await res.json();
    return response.data as Image[];
}

// Update a single product image
export async function updateProductImage(
    imageId: number,
    file: File,
    token: string
): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/images/image/${imageId}/update`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) throw new Error(`Failed to update image: ${res.status}`);
}

// Delete a product image
export async function deleteProductImage(
    imageId: number,
    token: string
): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/images/image/${imageId}/delete`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error(`Failed to delete image: ${res.status}`);
}
