import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { AuthLayout } from "./pages/Auth/AuthLayout.tsx";
import Login from "./pages/Auth/Login.tsx";
import { Register } from "./pages/Auth/Register.tsx";
import { PageLayout } from "./pages/PageLayout.tsx";
import { ProductListing } from "./pages/Product/ProductListing.tsx";
import { CartPage } from "./pages/Cart/CartPage.tsx";
import { WishlistPage } from "./pages/Wishlist/WishlistPage.tsx";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<PageLayout />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
            </Route>
            {/* Protected Routes */}
            {/* <Route element={<ProtectedRoute />}> */}
            <Route element={<App />}>
              <Route path="/dashboard" element={<>New Route</>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/shop" element={<ProductListing />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Route>
            {/* </Route> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
