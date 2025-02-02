import { useEffect, useRef, useState, useCallback } from 'react';
import { useGetCategoriesQuery, useGetProductsByFilterMutation, FilterParams, Product } from '../../services/productApi';
import { debounce } from 'lodash';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../store/features/wishlistSlice';
import { addToCart } from '../../store/features/cartSlice';
import { RootState } from '../../store/store';

const ITEMS_PER_PAGE = 12;

export const ProductListing = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    const [filters, setFilters] = useState<FilterParams>({
        page: 1,
        limit: ITEMS_PER_PAGE,
        categories: [],
        price: { min: 0, max: 10000 },
        discount: { min: 0, max: 100 },
        sortBy: 'price',
        sortOrder: 'desc',
        rating: 0
    });
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});
    const [imageCache, setImageCache] = useState<{ [key: string]: boolean }>({});

    const { data: categoriesData } = useGetCategoriesQuery();
    const [getProducts] = useGetProductsByFilterMutation();

    const observer = useRef<IntersectionObserver>();
    const lastProductRef = useRef<HTMLDivElement>(null);

    const handleImageLoad = useCallback((productId: number, imageUrl: string) => {
        setLoadingImages(prev => ({ ...prev, [productId]: false }));
        setImageCache(prev => ({ ...prev, [imageUrl]: true }));
    }, []);

    const handleImageError = useCallback((productId: number) => {
        setLoadingImages(prev => ({ ...prev, [productId]: false }));
    }, []);

    useEffect(() => {
        // Initialize loading state for all product images
        const newLoadingState = products.reduce((acc, product) => {
            const imageUrl = product.images.find(img => img.is_primary)?.url;
            // Only set loading to true if image is not cached
            acc[product.id] = imageUrl ? !imageCache[imageUrl] : true;
            return acc;
        }, {} as { [key: number]: boolean });
        
        setLoadingImages(prev => ({
            ...prev,
            ...newLoadingState
        }));
    }, [products, imageCache]);

    // Debounced search function
    const debouncedSearch = debounce((searchTerm: string) => {
        setFilters(prev => ({ ...prev, page: 1, search: searchTerm }));
        setProducts([]); // Reset products when search changes
    }, 500);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    // Handle category selection
    const handleCategoryChange = (categoryId: number) => {
        setFilters(prev => {
            const categories = prev.categories || [];
            const updatedCategories = categories.includes(categoryId)
                ? categories.filter(id => id !== categoryId)
                : [...categories, categoryId];
            return { ...prev, page: 1, categories: updatedCategories };
        });
        setProducts([]); // Reset products when categories change
    };

    // Handle price range change
    const handlePriceChange = (min: number, max: number) => {
        setFilters(prev => ({ ...prev, page: 1, price: { min, max } }));
        setProducts([]); // Reset products when price changes
    };

    // Handle discount range change
    const handleDiscountChange = (min: number, max: number) => {
        setFilters(prev => ({ ...prev, page: 1, discount: { min, max } }));
        setProducts([]); // Reset products when discount changes
    };

    // Handle rating change
    const handleRatingChange = (rating: number) => {
        // If clicking the same rating or setting to 0, clear the filter
        if (rating === filters.rating || rating === 0) {
            setFilters(prev => ({ ...prev, page: 1, rating: 0 }));
        } else {
            setFilters(prev => ({ ...prev, page: 1, rating }));
        }
        setProducts([]); // Reset products when rating changes
    };

    // Fetch products
    const fetchProducts = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await getProducts(filters).unwrap();
            setProducts(prev => {
                // Create a Map of existing products using their IDs
                const existingProducts = new Map(prev.map(p => [p.id, p]));
                
                // Add new products, overwriting any duplicates
                response.products.forEach(p => existingProducts.set(p.id, p));
                
                // Convert Map back to array
                return Array.from(existingProducts.values());
            });
            setHasMore(response.pagination.currentPage < response.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Set up intersection observer
    useEffect(() => {
        if (isLoading || !hasMore) return;

        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setFilters(prev => ({ ...prev, page: prev.page + 1 }));
            }
        });

        if (lastProductRef.current) {
            observer.current.observe(lastProductRef.current);
        }
    }, [isLoading, hasMore]);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [filters]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Filters Sidebar */}
            <div className="w-64 bg-white p-4 shadow-md">
                <div className="space-y-6">
                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Categories</h3>
                        <div className="space-y-2">
                            {categoriesData?.categories.map(category => (
                                <label key={category.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.categories?.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-600">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Min ($)</label>
                                    <input
                                        type="number"
                                        value={filters.price?.min ?? 0}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            handlePriceChange(value, filters.price?.max ?? 10000);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Max ($)</label>
                                    <input
                                        type="number"
                                        value={filters.price?.max ?? 10000}
                                        onChange={(e) => {
                                            const value = Math.max(filters.price?.min ?? 0, parseInt(e.target.value) || 0);
                                            handlePriceChange(filters.price?.min ?? 0, value);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min={filters.price?.min ?? 0}
                                    />
                                </div>
                            </div>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    value={filters.price?.min ?? 0}
                                    onChange={(e) => handlePriceChange(parseInt(e.target.value), filters.price?.max ?? 10000)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                    [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 
                                    [&::-webkit-slider-thumb]:bg-indigo-600 
                                    [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:hover:bg-indigo-700
                                    [&::-moz-range-thumb]:w-4 
                                    [&::-moz-range-thumb]:h-4 
                                    [&::-moz-range-thumb]:bg-indigo-600 
                                    [&::-moz-range-thumb]:border-0 
                                    [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:hover:bg-indigo-700"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    value={filters.price?.max ?? 10000}
                                    onChange={(e) => handlePriceChange(filters.price?.min ?? 0, parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                    [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 
                                    [&::-webkit-slider-thumb]:bg-indigo-600 
                                    [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:hover:bg-indigo-700
                                    [&::-moz-range-thumb]:w-4 
                                    [&::-moz-range-thumb]:h-4 
                                    [&::-moz-range-thumb]:bg-indigo-600 
                                    [&::-moz-range-thumb]:border-0 
                                    [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:hover:bg-indigo-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discount Range */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Discount Range (%)</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Min (%)</label>
                                    <input
                                        type="number"
                                        value={filters.discount.min}
                                        onChange={(e) => {
                                            const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                            handleDiscountChange(value, filters.discount.max);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Max (%)</label>
                                    <input
                                        type="number"
                                        value={filters.discount.max}
                                        onChange={(e) => {
                                            const value = Math.max(filters.discount.min, Math.min(100, parseInt(e.target.value) || filters.discount.min));
                                            handleDiscountChange(filters.discount.min, value);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min={filters.discount.min}
                                        max="100"
                                    />
                                </div>
                            </div>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={filters.discount.min}
                                    onChange={(e) => handleDiscountChange(parseInt(e.target.value), filters.discount.max)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                    [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 
                                    [&::-webkit-slider-thumb]:bg-indigo-600 
                                    [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:hover:bg-indigo-700
                                    [&::-moz-range-thumb]:w-4 
                                    [&::-moz-range-thumb]:h-4 
                                    [&::-moz-range-thumb]:bg-indigo-600 
                                    [&::-moz-range-thumb]:border-0 
                                    [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:hover:bg-indigo-700"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={filters.discount.max}
                                    onChange={(e) => handleDiscountChange(filters.discount.min, parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                    [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 
                                    [&::-webkit-slider-thumb]:bg-indigo-600 
                                    [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:hover:bg-indigo-700
                                    [&::-moz-range-thumb]:w-4 
                                    [&::-moz-range-thumb]:h-4 
                                    [&::-moz-range-thumb]:bg-indigo-600 
                                    [&::-moz-range-thumb]:border-0 
                                    [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:hover:bg-indigo-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Rating</h3>
                            {(filters?.rating ?? 0) > 0 && (
                                <button
                                    onClick={() => handleRatingChange(0)}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                >
                                    <span>Clear</span>
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className="group p-1 transition-all duration-200 hover:scale-110"
                                    title={`${rating} star${rating > 1 ? 's' : ''} and above`}
                                >
                                    <FaStar 
                                        className={`w-6 h-6 transition-colors duration-200 ${
                                            rating <= (filters.rating || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300 group-hover:text-yellow-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {(filters?.rating ?? 0) > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                Showing {(filters?.rating ?? 0)} {(filters?.rating ?? 0) === 1 ? 'star' : 'stars'} & above
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => {
                        const isInWishlist = wishlistItems.some(item => item.id === product.id);
                        return (
                            <div
                                key={product.id}
                                ref={index === products.length - 1 ? lastProductRef : null}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                                        onLoad={() => handleImageLoad(product.id, product.images.find(img => img.is_primary)?.url || '')}
                                        onError={() => handleImageError(product.id)}
                                        loading="lazy"
                                    />
                                    <button
                                        onClick={() => isInWishlist 
                                            ? dispatch(removeFromWishlist(product.id))
                                            : dispatch(addToWishlist(product))
                                        }
                                        className={`absolute top-2 left-2 p-2 rounded-full transition-colors duration-300 ${
                                            isInWishlist 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-white text-gray-600 hover:text-red-500'
                                        }`}
                                    >
                                        <FaHeart className="w-5 h-5" />
                                    </button>
                                    {product.discount > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                            {product.discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
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
                                    <div className="mt-4">
                                        <div className="flex items-center mb-3">
                                            {product.discount > 0 && (
                                                <span className="text-sm text-gray-500 line-through mr-2">
                                                    ${product.price}
                                                </span>
                                            )}
                                            <span className="text-xl font-bold text-indigo-600">
                                                ${product.final_price}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => dispatch(addToCart(product))}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                                        >
                                            <FaShoppingCart className="w-4 h-4" />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
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
        </div>
    );
};
