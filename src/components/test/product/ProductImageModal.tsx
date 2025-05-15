import React from 'react';

interface ProductImageModalProps {
  open: boolean;
  image: { url: string; id: number } | null;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export function ProductImageModal({ open, image, onClose, onDelete, loading }: ProductImageModalProps) {
  if (!open || !image) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full flex flex-col items-center relative">
        <img src={image.url} alt="Preview" className="max-h-80 rounded mb-4" />
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-black"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white"
            onClick={onDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
          onClick={onClose}
          aria-label="Close"
          disabled={loading}
        >
          ×
        </button>
      </div>
    </div>
  );
}
