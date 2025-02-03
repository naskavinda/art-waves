interface ProductPriceProps {
    price: number;
    finalPrice: number;
    discount: number;
    size?: 'small' | 'large';
}

export const ProductPrice = ({ price, finalPrice, discount, size = 'large' }: ProductPriceProps) => {
    const textSizeClass = size === 'large' ? 'text-3xl' : 'text-lg';
    const discountTextClass = size === 'large' ? 'text-xl' : 'text-sm';

    return (
        <div className="flex items-baseline space-x-2">
            {discount > 0 ? (
                <>
                    <p className={`${textSizeClass} font-bold text-indigo-600`}>${finalPrice.toFixed(2)}</p>
                    <p className={`${discountTextClass} text-gray-500 line-through`}>${price.toFixed(2)}</p>
                    {size === 'large' && <p className="text-lg text-red-500">-{discount}%</p>}
                </>
            ) : (
                <p className={`${textSizeClass} font-bold text-indigo-600`}>${price.toFixed(2)}</p>
            )}
        </div>
    );
};
