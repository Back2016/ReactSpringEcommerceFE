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
    longDescription: string;
    productSpecs: Record<string, string>;
};

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
