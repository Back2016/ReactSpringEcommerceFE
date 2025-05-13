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

export type CardProduct = Omit<Product, "images"> & {
    // Only use one feature image for the card product
    image: Image;
};

export type DetailedProduct = Product & {
    longDescription: string;
    productSpecs: Record<string, string>;
};
