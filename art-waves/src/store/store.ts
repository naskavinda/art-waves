import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { productApi } from '../services/productApi';
import { couponApi } from '../services/couponApi';
import authReducer from '../slices/authSlice';
import cartReducer from './features/cartSlice';
import wishlistReducer from './features/wishlistSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      couponApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;