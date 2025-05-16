export interface PaginatedResponse<T> {
    content: T[]
    totalPages: number
    totalElements: number
    number: number // current page index (0-based)
    size: number // page size
    numberOfElements: number
    first: boolean
    last: boolean
    empty: boolean
    sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
    }
    pageable: {
        pageNumber: number
        pageSize: number
        offset: number
        paged: boolean
        unpaged: boolean
        sort: {
            empty: boolean
            sorted: boolean
            unsorted: boolean
        }
    }
}



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

export interface UserDto {
    id: number
    firstName: string
    lastName: string
    email: string
    role: string
    orders: Order[]
    cart: CartResponse
}

export type SyncCartRequest = {
    productId: number
    quantity: number
}

export interface AddressDto {
    id?: number;
    recipientName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    defaultShipping: boolean;
    defaultBilling: boolean;
    zipcode: string;
}

export interface OrderItem {
    productId: number
    productName: string
    productBrand: string
    quantity: number
    price: number
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';


export interface Order {
    id: number
    userId: number
    orderDate: string
    totalAmount: number
    status: OrderStatus
    items: OrderItem[]
    shippingAddress: AddressDto
    billingAddress: AddressDto
}

export interface PlaceOrderRequest {
    shippingAddressId: number
    billingAddressId: number
}
