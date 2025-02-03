import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGetCartQuery } from '../../services/cartApi';
import {
  useGetPaymentMethodsQuery,
  useCreatePaymentMutation,
  PaymentMethod,
} from '../../services/paymentApi';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { data: cart, isLoading: isCartLoading } = useGetCartQuery();
  const { data: paymentMethods, isLoading: isMethodsLoading } = useGetPaymentMethodsQuery();
  const [createPayment, { isLoading: isProcessing }] = useCreatePaymentMutation();

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setError('');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      const response = await createPayment({
        orderId: cart?.id || '',
        amount: cart?.total || 0,
        currency: 'INR',
        paymentMethod: selectedMethod,
      }).unwrap();

      if (response.status === 'success') {
        navigate('/checkout/confirmation');
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while processing payment');
    }
  };

  if (isCartLoading || isMethodsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{cart?.subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹{cart?.shippingCost?.toFixed(2)}</span>
        </div>
        {cart?.discount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount</span>
            <span>-₹{cart.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
          <span>Total</span>
          <span>₹{cart?.total?.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        
        <div className="space-y-4">
          {paymentMethods?.map((method: PaymentMethod) => (
            <label
              key={method.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => handlePaymentMethodSelect(method.id)}
                className="form-radio text-primary"
              />
              <span className="ml-3">{method.name}</span>
            </label>
          ))}
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg font-medium
            hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export { PaymentPage };
