import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

// Check if there's a remembered token in localStorage
const getInitialState = (): AuthState => {
  const rememberedToken = localStorage.getItem('rememberedToken');
  return {
    isAuthenticated: !!rememberedToken,
    token: rememberedToken
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action: PayloadAction<{ token: string; rememberMe: boolean }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      
      if (action.payload.rememberMe) {
        localStorage.setItem('rememberedToken', action.payload.token);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('rememberedToken');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
