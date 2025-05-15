'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { addProduct, updateProduct, deleteProduct, fetchPaginatedProductsByCategory, fetchProduct } from '@/lib/api/product';
import { fetchCategories } from '@/lib/api/category';
import { Product, AddProductRequest, ProductUpdateRequest, DetailedProduct, Category } from '@/lib/types';
import { useAuthStore } from '@/store/useAuthStore';
import { withValidToken } from '@/lib/api/auth';
import { AddProductForm } from '@/components/test/product/AddProductForm';
import { UpdateProductForm } from '@/components/test/product/UpdateProductForm';
import { PaginationControls } from '@/components/layout/PaginationControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Upload } from 'lucide-react';
import ProductImageUploader from '@/components/test/image/ProductImageUploader';
import { deleteProductImage } from '@/lib/api/image';
import { ProductList } from '@/components/test/product/ProductList';
import { ProductImageModal } from '@/components/test/product/ProductImageModal';

const ITEMS_PER_PAGE = 4;

export default function ProductTestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { token, isAuthenticated, getAccessToken, isAccessTokenExpired, getUser, setToken, logout } = useAuthStore();
    const [hydrated, setHydrated] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageUploadProduct, setImageUploadProduct] = useState<Product | null>(null);
    const [viewImage, setViewImage] = useState<{ url: string; id: number } | null>(null);

    // Modal controls
    const [imageModalLoading, setImageModalLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated && !isAuthenticated) {
            router.push('/login');
        }
    }, [hydrated, isAuthenticated, router]);

    useEffect(() => {
        const page = searchParams.get('page');
        if (page) {
            setCurrentPage(parseInt(page));
        }
    }, [searchParams]);


    const fetchCategoriesData = async () => {
        try {
            const categoriesData = await fetchCategories();
            setCategories(categoriesData);
            if (categoriesData.length > 0 && !selectedCategory) {
                setSelectedCategory(categoriesData[0].name);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        if (hydrated) {
            fetchCategoriesData();
        }
    }, [hydrated]);

    const fetchProducts = async () => {
        if (!token || !selectedCategory) return;

        setIsLoading(true);

        try {
            const response = await withValidToken(
                async () =>
                    await fetchPaginatedProductsByCategory(selectedCategory, currentPage, ITEMS_PER_PAGE),
                { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
            );
            if (response) {
                setProducts(response.items);
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (hydrated && token && selectedCategory) {
            fetchProducts();
        }
    }, [hydrated, token, currentPage, selectedCategory]);

    const handleAddProduct = async (data: AddProductRequest) => {
        if (!token) return;

        setIsLoading(true);
        try {
            await withValidToken(
                async (token) => await addProduct(data, token),
                { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
            );
            toast.success('Product added successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to add product');
            console.error('Error adding product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (product: Product) => {
        if (!token) return;
        setImageUploadProduct(null);
        setIsLoading(true);
        try {
            const detailedProduct = await withValidToken(
                async (token) => await fetchProduct(product.id.toString()),
                { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
            );
            if (detailedProduct) {
                setSelectedProduct(detailedProduct);
                setEditModalOpen(true);
            } else {
                toast.error('Failed to fetch product details');
            }
        } catch (error) {
            toast.error('Failed to fetch product details');
            console.error('Error fetching product details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProduct = async (data: Omit<ProductUpdateRequest, 'id'>) => {
        if (!token || !selectedProduct) return;
        setIsLoading(true);
        try {
            await withValidToken(
                async (token) => await updateProduct(selectedProduct.id.toString(), { ...data, id: selectedProduct.id }, token),
                { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
            );
            toast.success('Product updated successfully');
            setSelectedProduct(null);
            setEditModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error('Failed to update product');
            console.error('Error updating product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!token) return;

        setIsLoading(true);
        try {
            await withValidToken(
                async (token) => await deleteProduct(productId.toString(), token),
                { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
            );
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
            console.error('Error deleting product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1); // Reset to first page when changing category
    };

    if (!hydrated) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Manage Products</h1>

            <div className="flex flex-col gap-8 lg:flex-col lg:items-start">
                {/* Add Product Form Card */}
                <div className="w-full"></div>

                {/* Product List Card */}
                <Card className="w-full flex-1">
                    <div className="mb-6 px-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Image section (approx 3/10 width) */}
                            <div className="basis-3/12 shrink-0 flex justify-center">
                                {selectedCategory && (
                                    <img
                                        src={
                                            categories.find((cat) => cat.name === selectedCategory)?.image || ''
                                        }
                                        alt={selectedCategory}
                                        className="w-50 h-50 rounded-md object-cover border border-gray-300 bg-gray-100"
                                    />
                                )}
                            </div>
                            {/* Dropdown section (approx 7/10 width) */}
                            <div className="basis-8/12">
                                <label
                                    htmlFor="category"
                                    className="block text-md font-medium text-black mb-2"
                                >
                                    Select Category
                                </label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm px-3 py-2"
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex-shrink-0 mr-15 mt-8">
                            <Button
                                className="bg-black text-white hover:bg-neutral-800"
                                onClick={() => setAddModalOpen(true)}
                            >
                                + Add New Product
                            </Button>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-4 px-6">Products</h2>
                    <ProductList
                        products={products}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDeleteProduct}
                        onUpload={(product) => { setImageUploadProduct(product); setUploadModalOpen(true); }}
                        onImageClick={(img) => setViewImage(img)}
                    />
                    <div className="mt-6">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </Card>
            </div>

            <ProductImageModal
                open={!!viewImage}
                image={viewImage}
                onClose={() => setViewImage(null)}
                loading={imageModalLoading}
                onDelete={async () => {
                    if (!viewImage) return;
                    setImageModalLoading(true);
                    try {
                        await deleteProductImage(viewImage.id, token || '');
                        toast.success('Image deleted!');
                        setViewImage(null);
                        fetchProducts();
                    } catch (err) {
                        toast.error('Failed to delete image');
                        setViewImage(null);
                    } finally {
                        setImageModalLoading(false);
                    }
                }}
            />

            {editModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full flex flex-col items-center relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                            onClick={() => { setEditModalOpen(false); setSelectedProduct(null); }}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <UpdateProductForm
                            product={selectedProduct}
                            onSubmit={handleUpdateProduct}
                            onCancel={() => { setEditModalOpen(false); setSelectedProduct(null); }}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            )}

            {addModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full flex flex-col items-center relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                            onClick={() => setAddModalOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <AddProductForm
                            onSubmit={async (data) => {
                                await handleAddProduct(data);
                                setAddModalOpen(false);
                            }}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            )}

            {uploadModalOpen && imageUploadProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full flex flex-col items-center relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                            onClick={() => { setUploadModalOpen(false); setImageUploadProduct(null); }}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <ProductImageUploader
                            productId={imageUploadProduct.id}
                            token={token || ''}
                            onUpload={(uploadedImages) => {
                                toast.success('Images uploaded!');
                                setUploadModalOpen(false);
                                setImageUploadProduct(null);
                                fetchProducts();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
