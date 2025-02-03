interface DiscountRange {
    min: number;
    max: number;
}

interface DiscountRangeFilterProps {
    discountRange: DiscountRange;
    onDiscountChange: (min: number, max: number) => void;
}

export const DiscountRangeFilter = ({ discountRange, onDiscountChange }: DiscountRangeFilterProps) => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Discount Range (%)</h3>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Min (%)</label>
                        <input
                            type="number"
                            value={discountRange.min}
                            onChange={(e) => {
                                const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                onDiscountChange(value, discountRange.max);
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
                            value={discountRange.max}
                            onChange={(e) => {
                                const value = Math.max(discountRange.min, Math.min(100, parseInt(e.target.value) || discountRange.min));
                                onDiscountChange(discountRange.min, value);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            min={discountRange.min}
                            max="100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
