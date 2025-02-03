import { Product } from '../../types/product';
import { StarRating } from '../shared/StarRating';
import { ProductPrice } from './ProductPrice';
import { useNavigate } from 'react-router';
import { FaArrowRight } from 'react-icons/fa';

interface RelatedProductsProps {
    products: Product[];
}

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
    const navigate = useNavigate();

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`);
        // Scroll to top when navigating
        window.scrollTo(0, 0);
    };

    return (
        <div className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
                    >
                        <div className="relative aspect-w-4 aspect-h-3 overflow-hidden">
                            <img
                                src={product.images.find(img => img.is_primary)?.url}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.discount > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                                    -{product.discount}%
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                {product.name}
                            </h3>
                            <div className="mb-3">
                                <StarRating 
                                    rating={product.average_rating} 
                                    reviewCount={product.review_count} 
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <ProductPrice
                                    price={product.price}
                                    finalPrice={product.final_price}
                                    discount={product.discount}
                                    size="small"
                                />
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaArrowRight className="text-indigo-600 w-5 h-5" />
                                </div>
                            </div>
                            {product.stock === 0 && (
                                <div className="mt-2 text-sm text-red-500 font-medium">
                                    Out of Stock
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
