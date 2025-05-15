import { useState, useRef } from 'react';
import { uploadProductImages } from '@/lib/api/image';
import Image from 'next/image';
import type { Image as ImageType } from '@/lib/types';

interface ProductImageUploaderProps {
    productId: number;
    token: string;
    onUpload: (uploadedImages: ImageType[]) => void;
}

export default function ProductImageUploader({ productId, token, onUpload }: ProductImageUploaderProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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
            const uploadedImages = await uploadProductImages(productId, selectedFiles, token);
            onUpload(uploadedImages);
            setSelectedFiles([]);
            setPreviewUrls([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload images');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow w-full">
            <h2 className="text-xl font-semibold mb-2">Upload a Product Image</h2>
            <div className="mb-4">
                <label
                    htmlFor="fileUpload"
                    className="cursor-pointer inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm hover:bg-blue-100"
                >
                    Choose an image
                </label>
                <input
                    id="fileUpload"
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {previewUrls.length === 0 && (
                <div className="ml-25 mb-4 w-100 h-100">
                    <div className="flex items-center justify-center aspect-square border rounded-lg text-gray-500 bg-gray-100">
                        No image uploaded
                    </div>
                </div>
            )}

            {previewUrls.length > 0 && (
                <div className="ml-25 mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square w-100 h-100">
                                <Image
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button
                onClick={handleUpload}
                disabled={isLoading || selectedFiles.length === 0}
                className="bg-blue-500 text-white ml-62 px-4 py-2 rounded-lg disabled:bg-gray-300"
            >
                {isLoading ? 'Uploading...' : 'Upload Image'}
            </button>
        </div>
    );
}
