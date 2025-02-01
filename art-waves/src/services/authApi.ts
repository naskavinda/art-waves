import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginResponse {
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/auth" }), // Replace with your API base URL
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResponse,
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: "login", // Replace with your login endpoint
        method: "POST",
        body: { email: username, password },
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

export const { useLoginMutation, useLogoutMutation } = authApi;
