import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Upload } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpload: (product: Product) => void;
  onImageClick: (image: { url: string; id: number }) => void;
}

export function ProductList({ products, isLoading, onEdit, onDelete, onUpload, onImageClick }: ProductListProps) {
  return (
    <div className="px-6 pb-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No products found</p>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 bg-white flex flex-col gap-2">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium font-bold truncate">{product.name}</h3>
                  <p className="mt-2 text-muted-foreground truncate">{product.description}</p>
                  <div className="mt-5 text-sm flex flex-wrap gap-x-4 gap-y-1">
                    <span><span className="font-medium">Price:</span> ${product.price.toFixed(2)}</span>
                    <span><span className="font-medium">Inventory:</span> {product.inventory}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="icon" className="bg-black hover:bg-neutral-800 text-white" onClick={() => onEdit(product)} aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => onDelete(product)} aria-label="Delete">
                    <Trash className="w-4 h-4" />
                  </Button>
                  <Button size="icon" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => onUpload(product)} aria-label="Upload Image">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {product.images && product.images.length > 0 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto">
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-35 w-35"
                      style={{ minWidth: '140px', minHeight: '140px' }}
                    >
                      <img
                        src={image.downloadUrl}
                        alt={`${product.name} - Image ${image.id}`}
                        className="h-35 w-35 object-cover rounded cursor-pointer"
                        onClick={() => onImageClick({ url: image.downloadUrl, id: image.id })}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded cursor-pointer"
                        onClick={() => onImageClick({ url: image.downloadUrl, id: image.id })}
                      >
                        <span className="text-white font-semibold text-lg">View Image</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
