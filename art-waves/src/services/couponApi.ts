import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface CouponRequest {
    code: string;
    cart_amount: number;
}

interface CouponResponse {
    original_amount: number;
    discount_percentage: number;
    discount_amount: number;
    final_amount: number;
}

export const couponApi = createApi({
    reducerPath: 'couponApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
    endpoints: (builder) => ({
        applyCoupon: builder.mutation<CouponResponse, CouponRequest>({
            query: (data) => ({
                url: '/coupons/apply',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useApplyCouponMutation } = couponApi;
