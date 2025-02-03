import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';

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

interface ProductCardProps {
    product: Product;
    isInWishlist: boolean;
    loadingImages: { [key: number]: boolean };
    onImageLoad: (productId: number, imageUrl: string) => void;
    onImageError: (productId: number) => void;
    onProductClick: (productId: number) => void;
    onWishlistToggle: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export const ProductCard = ({
    product,
    isInWishlist,
    loadingImages,
    onImageLoad,
    onImageError,
    onProductClick,
    onWishlistToggle,
    onAddToCart
}: ProductCardProps) => {
    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => onProductClick(product.id)}
        >
            <div className="relative pb-[100%]">
                {loadingImages[product.id] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                )}
                <img
                    src={product.images.find(img => img.is_primary)?.url}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                        loadingImages[product.id] ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => onImageLoad(product.id, product.images.find(img => img.is_primary)?.url || '')}
                    onError={() => onImageError(product.id)}
                    loading="lazy"
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onWishlistToggle(product);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-300 ${
                        isInWishlist 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white text-gray-600 hover:text-red-500'
                    }`}
                >
                    <FaHeart className="w-5 h-5" />
                </button>
                {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                        -{product.discount}%
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`w-4 h-4 ${
                                    i < Math.floor(product.average_rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.review_count})</span>
                </div>
                <div className="mt-3">
                    <div className="flex items-center mb-2">
                        {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through mr-2">
                                ${product.price}
                            </span>
                        )}
                        <span className="text-lg sm:text-xl font-bold text-indigo-600">
                            ${product.final_price}
                        </span>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm sm:text-base"
                    >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
