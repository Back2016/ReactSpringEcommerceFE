'use client';

import { useState } from 'react';
import { DetailedProduct, ProductUpdateRequest } from '@/lib/types';

interface UpdateProductFormProps {
    product: DetailedProduct;
    onSubmit: (data: Omit<ProductUpdateRequest, 'id'>) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

const initialUpdateState: Omit<ProductUpdateRequest, 'id'> = {
    name: '',
    brand: '',
    description: '',
    longDescription: '',
    price: 0,
    inventory: 0,
    category: { name: '' },
};

export function UpdateProductForm({ product, onSubmit, onCancel, isLoading }: UpdateProductFormProps) {
    const [updateData, setUpdateData] = useState<Omit<ProductUpdateRequest, 'id'>>({
        name: product.name,
        brand: product.brand || '',
        description: product.description,
        longDescription: product.longDescription || '',
        price: product.price,
        inventory: product.inventory,
        category: { name: product.category.name },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(updateData);
    };

    return (
        <div className="bg-white w-full p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Update Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={updateData.name}
                        onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                        type="text"
                        value={updateData.brand}
                        onChange={(e) => setUpdateData({ ...updateData, brand: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={updateData.description}
                        onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Long Description</label>
                    <textarea
                        value={updateData.longDescription}
                        onChange={(e) => setUpdateData({ ...updateData, longDescription: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        value={updateData.price}
                        onChange={(e) => setUpdateData({ ...updateData, price: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Inventory</label>
                    <input
                        type="number"
                        value={updateData.inventory}
                        onChange={(e) => setUpdateData({ ...updateData, inventory: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        value={updateData.category.name}
                        onChange={(e) => setUpdateData({ ...updateData, category: { name: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                    >
                        {isLoading ? 'Updating...' : 'Update Product'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
