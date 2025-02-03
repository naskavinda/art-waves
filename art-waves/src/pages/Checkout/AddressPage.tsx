import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../../store/store';
import { Input } from '../../components/ui/Input';
import { useSaveAddressMutation } from '../../services/addressApi';

export const AddressPage = () => {
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const user = useSelector((state: RootState) => state.auth.user);
    const [saveAddress, { isLoading }] = useSaveAddressMutation();
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = React.useState<string>('');

    // Load user details when component mounts
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstname || '',
                lastName: user.lastname || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    React.useEffect(() => {
        // Redirect to cart if cart is empty
        if (cartItems.length === 0) {
            navigate("/checkout");
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (submitError) {
            setSubmitError('');
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        if (!formData.country) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        
        if (validateForm()) {
            try {
                if (!user?.id) {
                    throw new Error('User ID not found');
                }

                await saveAddress({
                    userId: user.id,
                    type: 'shipping',
                    address: {
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        postalCode: formData.zipCode,
                        country: formData.country
                    }
                }).unwrap();

                // If address save is successful, navigate to payment page
                navigate('/checkout/payment');
            } catch (error) {
                console.error('Error saving address:', error);
                setSubmitError(
                    error instanceof Error 
                        ? error.message 
                        : 'Failed to save address. Please try again.'
                );
            }
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + (item.final_price * item.quantity), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Checkout Progress */}
            <div className="mb-8">
                <div className="max-w-3xl mx-auto">
                    <nav className="flex items-center justify-center" aria-label="Progress">
                        <ol className="flex items-center space-x-5">
                            <li className="flex items-center">
                                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span className="ml-2 text-sm font-medium text-gray-900">Cart</span>
                            </li>

                            <li className="flex items-center">
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900">Address</span>
                            </li>

                            <li className="flex items-center">
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                                    <span className="text-sm text-gray-500">3</span>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Address Form */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h1>
                        
                        {submitError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-400 text-red-700 rounded-md flex items-center">
                                <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {submitError}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    error={errors.firstName}
                                />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    error={errors.lastName}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                />
                                <Input
                                    label="Phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={errors.phone}
                                />
                            </div>
                            
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                error={errors.address}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    error={errors.city}
                                />
                                <Input
                                    label="State/Province"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    error={errors.state}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="ZIP/Postal Code"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    error={errors.zipCode}
                                />
                                <Input
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    error={errors.country}
                                />
                            </div>

                            <div className="flex justify-between pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/checkout')}
                                    disabled={isLoading}
                                    className={`${
                                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    } bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300`}
                                >
                                    Back to Cart
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex items-center space-x-2 ${
                                        isLoading 
                                            ? 'bg-indigo-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    } text-white py-2 px-4 rounded-md transition-colors duration-300`}
                                >
                                    {isLoading && (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    <span>{isLoading ? 'Saving...' : 'Continue to Payment'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4">
                                    <img
                                        src={item.images.find(img => img.is_primary)?.url}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            ${(item.final_price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-base font-medium text-gray-900">Subtotal</span>
                                    <span className="text-base font-medium text-gray-900">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm text-gray-500">Shipping</span>
                                    <span className="text-sm text-gray-500">Calculated at next step</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
