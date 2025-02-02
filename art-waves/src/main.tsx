import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Auth/Login.tsx";
import { AuthLayout } from "./pages/Auth/AuthLayout.tsx";
import { Register } from "./pages/Auth/Register.tsx";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { ProtectedRoute } from "./components/ProtectedRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
          </Route>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<App />}>
              <Route path="/dashboard" element={<>New Route</>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
