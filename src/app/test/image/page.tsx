'use client';

import { useState, useRef } from 'react';
import { uploadProductImages } from '@/lib/api/image';
import Image from 'next/image';

export default function ImageTestPage() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);

        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError('Please select at least one image');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = 'your-auth-token'; // Replace with actual token
            const productId = 23; // Replace with actual product ID

            const uploaded = await uploadProductImages(productId, selectedFiles, token);
            setUploadedImages(uploaded);

            setSelectedFiles([]);
            setPreviewUrls([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload images');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Image Upload Test</h1>

            <div className="mb-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>

            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Preview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.length === 0 ? (
                        <div className="flex items-center justify-center aspect-square border rounded-lg text-gray-500 bg-gray-100">
                            No image selected
                        </div>
                    ) : (
                        previewUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square">
                                <Image
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button
                onClick={handleUpload}
                disabled={isLoading || selectedFiles.length === 0}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
            >
                {isLoading ? 'Uploading...' : 'Upload Images'}
            </button>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Uploaded Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.length === 0 ? (
                        <div className="flex items-center justify-center aspect-square border rounded-lg text-gray-500 bg-gray-100">
                            No image uploaded
                        </div>
                    ) : (
                        uploadedImages.map((image, index) => (
                            <div key={index} className="relative aspect-square">
                                <Image
                                    src={image.url}
                                    alt={`Uploaded ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
