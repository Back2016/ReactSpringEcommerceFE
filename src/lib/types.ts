export interface Category {
    id: number
    name: string
    image: string
}

export interface Image {
    id: number
    fileName: string
    downloadUrl: string
}


export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    inventory: number;
    images: Image[];
    category: Category;
};

export type CardProduct = {
    id: number
    name: string
    description: string
    price: number
    inventory: number
    image: Image
    category: Category
    quantity?: number
}

export type DetailedProduct = Product & {
    brand: string;
    longDescription: string;
    productSpecs: Record<string, string>;
};

export interface AddProductRequest {
    name: string;
    brand: string;
    price: number;
    inventory: number;
    description: string;
    longDescription: string;
    category: {
        name: string;
    };
}

export interface ProductUpdateRequest {
    id: number;
    name: string;
    brand: string;
    price: number;
    inventory: number;
    description: string;
    longDescription: string;
    category: {
        name: string;
    };
}


export type CartItem = {
    id: number
    cartId: number
    productId: number
    quantity: number
}

export type CartItems = {
    itemId: number
    quantity: number
    unitPrice: number
    totalPrice: number
    product: Product
}

export type CartResponse = {
    cartId: number
    items: CartItems[]
    totalAmount: number
}

export type SyncCartRequest = {
    productId: number
    quantity: number
}
