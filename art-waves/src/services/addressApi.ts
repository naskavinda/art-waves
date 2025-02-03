import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface SaveAddressRequest {
    userId: string;
    type: 'normal' | 'shipping' | 'billing';
    address: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
    endpoints: (builder) => ({
        saveAddress: builder.mutation<void, SaveAddressRequest>({
            query: (body) => ({
                url: '/address/save',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useSaveAddressMutation } = addressApi;
