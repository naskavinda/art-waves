import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../services/productApi';

interface WishlistState {
    items: Product[];
}

// Load initial state from localStorage
const loadWishlistState = (): WishlistState => {
    try {
        const savedState = localStorage.getItem('wishlist');
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
    }
    return { items: [] };
};

const initialState: WishlistState = loadWishlistState();

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<Product>) => {
            if (!state.items.find(item => item.id === action.payload.id)) {
                state.items.push(action.payload);
                // Save to localStorage
                localStorage.setItem('wishlist', JSON.stringify(state));
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter(item => String(item.id) !== String(action.payload));
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        clearWishlist: (state) => {
            state.items = [];
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
