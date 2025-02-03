export interface Image {
    url: string;
    is_primary?: boolean;
}

export interface Review {
    id: number;
    rating: number;
    reviewer_name: string;
    date: string;
    comment: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    final_price: number;
    discount: number;
    average_rating: number;
    review_count: number;
    stock: number;
    images: Image[];
    reviews: Review[];
}

export interface ProductDetailsData {
    product: Product;
    relatedProducts: Product[];
}
