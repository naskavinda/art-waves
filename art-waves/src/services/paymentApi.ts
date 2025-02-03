import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  name: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  id: string;
  status: 'pending' | 'success' | 'failed';
  amount: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => 'payment/methods',
    }),
    createPayment: builder.mutation<PaymentResponse, CreatePaymentRequest>({
      query: (data) => ({
        url: 'payment',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.mutation<PaymentResponse, string>({
      query: (paymentId) => ({
        url: `payment/${paymentId}/verify`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
} = paymentApi;
