import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../../store/store';
import { Input } from '../../components/ui/Input';

export const AddressPage = () => {
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const user = useSelector((state: RootState) => state.auth.user);
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
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            // TODO: Save address
            navigate('/checkout/payment');
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + (item.final_price * item.quantity), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Address Form */}
                <div className="lg:col-span-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h1>
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
                                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
                            >
                                Back to Cart
                            </button>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-gray-50 rounded-lg p-6">
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
