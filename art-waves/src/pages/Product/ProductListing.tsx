import { useEffect, useRef, useState } from 'react';
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
        sortOrder: 'desc'
    });
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});

    const { data: categoriesData } = useGetCategoriesQuery();
    const [getProducts] = useGetProductsByFilterMutation();

    const observer = useRef<IntersectionObserver>();
    const lastProductRef = useRef<HTMLDivElement>(null);

    const handleImageLoad = (productId: number) => {
        setLoadingImages(prev => ({ ...prev, [productId]: false }));
    };

    const handleImageError = (productId: number) => {
        setLoadingImages(prev => ({ ...prev, [productId]: false }));
    };

    useEffect(() => {
        // Initialize loading state for all product images
        const newLoadingState = products.reduce((acc, product) => {
            acc[product.id] = true;
            return acc;
        }, {} as { [key: number]: boolean });
        setLoadingImages(newLoadingState);
    }, [products]);

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
        setFilters(prev => ({ ...prev, page: 1, rating }));
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
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                value={filters.price?.min}
                                onChange={(e) => handlePriceChange(Number(e.target.value), filters.price?.max || 10000)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>${filters.price?.min}</span>
                                <span>${filters.price?.max}</span>
                            </div>
                        </div>
                    </div>

                    {/* Discount Range */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Discount</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={filters.discount?.min}
                                onChange={(e) => handleDiscountChange(Number(e.target.value), filters.discount?.max || 100)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{filters.discount?.min}%</span>
                                <span>{filters.discount?.max}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Rating</h3>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className={`p-1 ${filters.rating === rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    <FaStar className="w-6 h-6" />
                                </button>
                            ))}
                        </div>
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
                                        onLoad={() => handleImageLoad(product.id)}
                                        onError={() => handleImageError(product.id)}
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
