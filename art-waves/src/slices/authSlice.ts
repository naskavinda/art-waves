import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type User } from "../models/User";


interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

// Check if there's remembered data in localStorage
const getInitialState = (): AuthState => {
  const rememberedToken = localStorage.getItem('rememberedToken');
  const rememberedUser = localStorage.getItem('rememberedUser');
  return {
    isAuthenticated: !!rememberedToken,
    token: rememberedToken,
    user: rememberedUser ? JSON.parse(rememberedUser) : null
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User; rememberMe: boolean }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      
      if (action.payload.rememberMe) {
        localStorage.setItem('rememberedToken', action.payload.token);
        localStorage.setItem('rememberedUser', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('rememberedToken');
      localStorage.removeItem('rememberedUser');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
