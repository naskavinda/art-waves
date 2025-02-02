import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { removeFromCart, updateQuantity } from '../../store/features/cartSlice';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

export const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalAmount = cartItems.reduce((total, item) => total + (item.final_price * item.quantity), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Add some items to your cart to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 py-4">
                                <img
                                    src={item.images.find(img => img.is_primary)?.url}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500">${item.final_price}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                        className="p-2 text-gray-500 hover:text-indigo-600"
                                        disabled={item.quantity <= 1}
                                    >
                                        <FaMinus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                        className="p-2 text-gray-500 hover:text-indigo-600"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-medium text-gray-900">
                                        ${(item.final_price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-gray-900">Calculated at checkout</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-medium text-gray-900">Total</span>
                                        <span className="text-lg font-medium text-gray-900">
                                            ${totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
