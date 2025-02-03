import { SearchInput } from './SearchInput';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { DiscountRangeFilter } from './DiscountRangeFilter';
import { RatingFilter } from './RatingFilter';

interface Category {
    id: number;
    name: string;
}

interface FilterParams {
    categories?: number[];
    price: { min: number; max: number };
    discount: { min: number; max: number };
    rating: number;
}

interface ProductFiltersProps {
    isSidebarOpen: boolean;
    onCloseSidebar: () => void;
    search: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filters: FilterParams;
    categories: Category[];
    onCategoryChange: (categoryId: number) => void;
    onPriceChange: (min: number, max: number) => void;
    onDiscountChange: (min: number, max: number) => void;
    onRatingChange: (rating: number) => void;
}

export const ProductFilters = ({
    isSidebarOpen,
    onCloseSidebar,
    search,
    onSearchChange,
    filters,
    categories,
    onCategoryChange,
    onPriceChange,
    onDiscountChange,
    onRatingChange
}: ProductFiltersProps) => {
    return (
        <div className={`
            fixed lg:static inset-y-0 left-0 z-50 
            w-80 lg:w-64 bg-white shadow-md 
            transform lg:transform-none transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
        `}>
            <div className="p-4 space-y-6">
                {/* Mobile Close Button */}
                <div className="flex justify-between items-center lg:hidden">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button 
                        onClick={onCloseSidebar}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <SearchInput value={search} onChange={onSearchChange} />
                
                <CategoryFilter
                    categories={categories}
                    selectedCategories={filters.categories || []}
                    onCategoryChange={onCategoryChange}
                />

                <PriceRangeFilter
                    priceRange={filters.price}
                    onPriceChange={onPriceChange}
                />

                <DiscountRangeFilter
                    discountRange={filters.discount}
                    onDiscountChange={onDiscountChange}
                />

                <RatingFilter
                    rating={filters.rating}
                    onRatingChange={onRatingChange}
                />
            </div>
        </div>
    );
};
