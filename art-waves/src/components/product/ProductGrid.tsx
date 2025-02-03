import { RefObject } from 'react';
import { ProductCard } from './ProductCard';

interface ProductImage {
    url: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    price: number;
    final_price: number;
    discount: number;
    average_rating: number;
    review_count: number;
    images: ProductImage[];
}

interface ProductGridProps {
    products: Product[];
    wishlistItems: Product[];
    loadingImages: { [key: number]: boolean };
    isLoading: boolean;
    lastProductRef: RefObject<HTMLDivElement>;
    onImageLoad: (productId: number, imageUrl: string) => void;
    onImageError: (productId: number) => void;
    onProductClick: (productId: number) => void;
    onWishlistToggle: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({
    products,
    wishlistItems,
    loadingImages,
    isLoading,
    lastProductRef,
    onImageLoad,
    onImageError,
    onProductClick,
    onWishlistToggle,
    onAddToCart
}: ProductGridProps) => {
    return (
        <div className="flex-1 p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, index) => {
                    const isInWishlist = wishlistItems.some(item => item.id === product.id);
                    return (
                        <div 
                            key={product.id} 
                            ref={index === products.length - 1 ? lastProductRef : null}
                        >
                            <ProductCard
                                product={product}
                                isInWishlist={isInWishlist}
                                loadingImages={loadingImages}
                                onImageLoad={onImageLoad}
                                onImageError={onImageError}
                                onProductClick={onProductClick}
                                onWishlistToggle={onWishlistToggle}
                                onAddToCart={onAddToCart}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center my-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            )}
        </div>
    );
};
