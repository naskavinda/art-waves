import { useEffect, useRef, useState, useCallback } from 'react';
import { useGetCategoriesQuery, useGetProductsByFilterMutation, FilterParams, Product } from '../../services/productApi';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../store/features/wishlistSlice';
import { addToCart } from '../../store/features/cartSlice';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router';
import { ProductFilters } from '../../components/product/filters/ProductFilters';
import { ProductGrid } from '../../components/product/ProductGrid';

const ITEMS_PER_PAGE = 12;

export const ProductListing = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const navigate = useNavigate();

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        const newLoadingState = products.reduce((acc, product) => {
            const imageUrl = product.images.find(img => img.is_primary)?.url;
            acc[product.id] = imageUrl ? !imageCache[imageUrl] : true;
            return acc;
        }, {} as { [key: number]: boolean });
        
        setLoadingImages(prev => ({
            ...prev,
            ...newLoadingState
        }));
    }, [products, imageCache]);

    const debouncedSearch = debounce((searchTerm: string) => {
        setFilters(prev => ({ ...prev, page: 1, search: searchTerm }));
        setProducts([]); 
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleCategoryChange = (categoryId: number) => {
        setFilters(prev => {
            const categories = prev.categories || [];
            const updatedCategories = categories.includes(categoryId)
                ? categories.filter(id => id !== categoryId)
                : [...categories, categoryId];
            return { ...prev, page: 1, categories: updatedCategories };
        });
        setProducts([]);
    };

    const handlePriceChange = (min: number, max: number) => {
        setFilters(prev => ({ ...prev, page: 1, price: { min, max } }));
        setProducts([]);
    };

    const handleDiscountChange = (min: number, max: number) => {
        setFilters(prev => ({ ...prev, page: 1, discount: { min, max } }));
        setProducts([]);
    };

    const handleRatingChange = (rating: number) => {
        if (rating === filters.rating || rating === 0) {
            setFilters(prev => ({ ...prev, page: 1, rating: 0 }));
        } else {
            setFilters(prev => ({ ...prev, page: 1, rating }));
        }
        setProducts([]);
    };

    const fetchProducts = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await getProducts(filters).unwrap();
            setProducts(prev => {
                const existingProducts = new Map(prev.map(p => [p.id, p]));
                response.products.forEach(p => existingProducts.set(p.id, p));
                return Array.from(existingProducts.values());
            });
            setHasMore(response.pagination.currentPage < response.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    const handleWishlistToggle = (product: Product) => {
        const isInWishlist = wishlistItems.some(item => item.id === product.id);
        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button>
            </div>

            {/* Overlay for mobile filter sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex flex-col lg:flex-row">
                <ProductFilters
                    isSidebarOpen={isSidebarOpen}
                    onCloseSidebar={() => setIsSidebarOpen(false)}
                    search={search}
                    onSearchChange={handleSearchChange}
                    filters={filters}
                    categories={categoriesData?.categories || []}
                    onCategoryChange={handleCategoryChange}
                    onPriceChange={handlePriceChange}
                    onDiscountChange={handleDiscountChange}
                    onRatingChange={handleRatingChange}
                />

                <ProductGrid
                    products={products}
                    wishlistItems={wishlistItems}
                    loadingImages={loadingImages}
                    isLoading={isLoading}
                    lastProductRef={lastProductRef}
                    onImageLoad={handleImageLoad}
                    onImageError={handleImageError}
                    onProductClick={handleProductClick}
                    onWishlistToggle={handleWishlistToggle}
                    onAddToCart={handleAddToCart}
                />
            </div>
        </div>
    );
};
