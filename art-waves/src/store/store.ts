import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { productApi } from '../services/productApi';
import { cartApi } from '../services/cartApi';
// import { wishlistApi } from '../services/wishlistApi';
import { couponApi } from '../services/couponApi';
import { addressApi } from '../services/addressApi';
import { paymentApi } from '../services/paymentApi';
import authReducer from '../slices/authSlice';
import cartReducer from './features/cartSlice';
import wishlistReducer from './features/wishlistSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    // [wishlistApi.reducerPath]: wishlistApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      // wishlistApi.middleware,
      couponApi.middleware,
      addressApi.middleware,
      paymentApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;