import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../services/productApi';

interface WishlistState {
    items: Product[];
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<Product>) => {
            if (!state.items.find(item => item.id === action.payload.id)) {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter(item => String(item.id) !== String(action.payload));
        },
    },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
