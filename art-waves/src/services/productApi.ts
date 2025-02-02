import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface ProductImage {
  url: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  final_price: number;
  category_id: number;
  stock: number;
  average_rating: number;
  review_count: number;
  images: ProductImage[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterParams {
  page: number;
  limit: number;
  categories?: number[];
  price: PriceRange;
  discount: PriceRange;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ProductResponse {
  products: Product[];
  pagination: PaginationInfo;
  filters: FilterParams;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<{ categories: Category[] }, void>({
      query: () => "/products/categories",
      providesTags: ["Categories"],
    }),

    getProductsByFilter: builder.mutation<ProductResponse, FilterParams>({
      query: (filterParams) => ({
        url: "/products/filter",
        method: "POST",
        body: filterParams,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsByFilterMutation,
} = productApi;
