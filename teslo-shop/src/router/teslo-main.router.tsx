import { createBrowserRouter, Navigate } from "react-router"
import { ShopLayout } from "../shop/layouts/ShopLayout";
import { HomePage } from "../shop/pages/home/HomePage";
import { ProductPage } from "../shop/pages/product/ProductPage";
import { GenderPage } from "../shop/pages/gender/GenderPage";
import { LoginPage } from "../auth/pages/login/LoginPage";
import { RegisterPage } from "../auth/pages/register/RegisterPage";
import { AdminProductsPage } from "../admin/pages/products/AdminProductsPage";
import { AdminProductPage } from "../admin/pages/product/AdminProductPage";
import { lazy } from "react";

const AuthLayout = lazy(() => import('@/auth/layouts/AuthLayout'));
const AdminLayout = lazy(() => import('@/admin/layouts/AdminLayout'));

export const tesloMainRouter = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <ShopLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'product/:idSlug',
        element: <ProductPage />,
      },
      {
        path: 'gender/:gender',
        element: <GenderPage />,
      }
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
      },
      {
        path: 'products/:idProduct',
        element: <AdminProductPage />,
      }
    ],
  },
  // Auth routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" />
  }
]);
