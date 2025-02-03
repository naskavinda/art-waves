interface Category {
    id: number;
    name: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategories: number[];
    onCategoryChange: (categoryId: number) => void;
}

export const CategoryFilter = ({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
                {categories?.map(category => (
                    <label key={category.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedCategories?.includes(category.id)}
                            onChange={() => onCategoryChange(category.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{category.name}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
