interface PriceRange {
    min: number;
    max: number;
}

interface PriceRangeFilterProps {
    priceRange: PriceRange;
    onPriceChange: (min: number, max: number) => void;
}

export const PriceRangeFilter = ({ priceRange, onPriceChange }: PriceRangeFilterProps) => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Min ($)</label>
                        <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                onPriceChange(value, priceRange.max);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Max ($)</label>
                        <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => {
                                const value = Math.max(priceRange.min, parseInt(e.target.value) || 0);
                                onPriceChange(priceRange.min, value);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            min={priceRange.min}
                        />
                    </div>
                </div>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange.min}
                        onChange={(e) => onPriceChange(parseInt(e.target.value), priceRange.max)}
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
                        value={priceRange.max}
                        onChange={(e) => onPriceChange(priceRange.min, parseInt(e.target.value))}
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
    );
};
