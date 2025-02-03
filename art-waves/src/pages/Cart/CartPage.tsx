import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { removeFromCart, updateQuantity } from '../../store/features/cartSlice';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useApplyCouponMutation } from '../../services/couponApi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const user = useSelector((state: RootState) => state.auth.user);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discountPercentage: number;
        discountAmount: number;
    } | null>(null);
    const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

    const subtotal = cartItems.reduce((total, item) => total + (item.final_price * item.quantity), 0);
    const totalSavingsFromDiscounts = cartItems.reduce((total, item) => {
        const discountAmount = item.price - item.final_price;
        return total + (discountAmount * item.quantity);
    }, 0);

    // Recalculate coupon discount when cart changes
    useEffect(() => {
        if (appliedCoupon && appliedCoupon.code) {
            handleApplyCoupon(appliedCoupon.code, false);
        }
    }, [subtotal]);

    const handleApplyCoupon = async (code: string, showSuccess = true) => {
        setCouponError('');
        try {
            const response = await applyCoupon({
                code,
                cart_amount: subtotal
            }).unwrap();

            setAppliedCoupon({
                code,
                discountPercentage: response.discount_percentage,
                discountAmount: response.discount_amount
            });
            if (showSuccess) {
                setCouponCode('');
            }
        } catch (error: any) {
            console.error('Error applying coupon:', error);
            setAppliedCoupon(null);
            
            if (error.data?.error) {
                setCouponError(error.data.error);
            } else {
                setCouponError('Error applying coupon. Please try again.');
            }
        }
    };

    const handleCheckout = () => {
        if (!user) {
            // If user is not logged in, redirect to login page with return URL
            navigate('/login', { 
                state: { from: '/checkout/address' },
                replace: true
            });
            return;
        }

        // Proceed to address page
        navigate('/checkout/address');
    };

    const finalTotal = appliedCoupon 
        ? subtotal - appliedCoupon.discountAmount 
        : subtotal;

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
                                    <div className="flex items-center space-x-2">
                                        <p className="text-gray-900 font-medium">${item.final_price}</p>
                                        {item.discount > 0 && (
                                            <>
                                                <p className="text-gray-500 line-through">${item.price}</p>
                                                <p className="text-red-500">-{item.discount}%</p>
                                            </>
                                        )}
                                    </div>
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
                            
                            {/* Coupon Input */}
                            <div className="mb-4">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => {
                                            setCouponCode(e.target.value);
                                            setCouponError('');
                                        }}
                                        placeholder="Enter coupon code"
                                        className={`flex-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                            couponError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    <button
                                        onClick={() => handleApplyCoupon(couponCode)}
                                        disabled={isApplyingCoupon || !couponCode}
                                        className={`px-4 py-2 text-white rounded-md transition-colors duration-300 ${
                                            isApplyingCoupon || !couponCode
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                                    </button>
                                </div>
                                {couponError && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {couponError}
                                    </div>
                                )}
                                {appliedCoupon && (
                                    <div className="mt-2 text-sm text-green-600">
                                        Coupon {appliedCoupon.code} applied: {appliedCoupon.discountPercentage}% off
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>

                                {totalSavingsFromDiscounts > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Product Discounts</span>
                                        <span>-${totalSavingsFromDiscounts.toFixed(2)}</span>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-gray-900">Calculated at checkout</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-medium text-gray-900">Total</span>
                                        <span className="text-lg font-medium text-gray-900">
                                            ${finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                                >
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
