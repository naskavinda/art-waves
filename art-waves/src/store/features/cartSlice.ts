import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../services/productApi';

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

// Load initial state from localStorage
const loadCartState = (): CartState => {
    try {
        const savedState = localStorage.getItem('cart');
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
    return { items: [] };
};

const initialState: CartState = loadCartState();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter(item => String(item.id) !== String(action.payload));
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateQuantity: (state, action: PayloadAction<{ id: string | number; quantity: number }>) => {
            const item = state.items.find(item => String(item.id) === String(action.payload.id));
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity);
                // Save to localStorage
                localStorage.setItem('cart', JSON.stringify(state));
            }
        },
        clearCart: (state) => {
            state.items = [];
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
