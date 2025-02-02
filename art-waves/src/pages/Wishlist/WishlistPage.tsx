import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { removeFromWishlist } from '../../store/features/wishlistSlice';
import { addToCart } from '../../store/features/cartSlice';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';

export const WishlistPage = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    const handleAddToCart = (product: any) => {
        dispatch(addToCart(product));
        dispatch(removeFromWishlist(product.id));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
            
            {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-medium text-gray-900 mb-4">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8">Add items to your wishlist while shopping to save them for later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative pb-[100%]">
                                <img
                                    src={item.images.find(img => img.is_primary)?.url}
                                    alt={item.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {item.discount > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                        {item.discount}% OFF
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        {item.discount > 0 && (
                                            <span className="text-sm text-gray-500 line-through mr-2">
                                                ${item.price}
                                            </span>
                                        )}
                                        <span className="text-lg font-bold text-indigo-600">
                                            ${item.final_price}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => dispatch(removeFromWishlist(item.id))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                                >
                                    <FaShoppingCart className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
