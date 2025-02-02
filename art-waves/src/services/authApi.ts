import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginResponse {
  token: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  imageUrl?: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    imageUrl?: string;
  }
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/auth" }), // Replace with your API base URL
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout", // Replace with your logout endpoint
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
