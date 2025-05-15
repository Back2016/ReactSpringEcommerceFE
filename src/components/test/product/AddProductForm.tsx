'use client';

import { useState } from 'react';
import { AddProductRequest } from '@/lib/types';
import { Plus } from 'lucide-react';

interface AddProductFormProps {
    onSubmit: (data: AddProductRequest) => Promise<void>;
    isLoading: boolean;
}

const initialFormState: AddProductRequest = {
    name: '',
    brand: '',
    description: '',
    longDescription: '',
    price: 0,
    inventory: 0,
    category: { name: '' },
};

export function AddProductForm({ onSubmit, isLoading }: AddProductFormProps) {
    const [formData, setFormData] = useState<AddProductRequest>(initialFormState);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData(initialFormState);
    };

    return (
        <div className="w-full bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Long Description</label>
                    <textarea
                        value={formData.longDescription}
                        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Inventory</label>
                    <input
                        type="number"
                        value={formData.inventory}
                        onChange={(e) => setFormData({ ...formData, inventory: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        value={formData.category.name}
                        onChange={(e) => setFormData({ ...formData, category: { name: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-300 flex items-center justify-center"
                >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={4}/>
                    {isLoading ? 'Adding...' : 'Add Product'}
                </button>

            </form>
        </div>
    );
}
