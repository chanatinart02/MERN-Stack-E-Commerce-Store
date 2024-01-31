import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import App from "./App.jsx";
import "./index.css";

import store from "./redux/store";

// Auth
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Favorites from "./pages/Products/Favorites.jsx";

import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import UserOrder from "./pages/User/UserOrder.jsx";

// Private Route
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/User/Profile.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/placeOrder.jsx";
import Order from "./pages/Orders/Order.jsx";

// Admin Routes
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "favorite",
        element: <Favorites />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "user-orders",
        element: <UserOrder />,
      },
      // Private routes must auth
      {
        path: "",
        element: <PrivateRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "shipping",
            element: <Shipping />,
          },
          {
            path: "placeorder",
            element: <PlaceOrder />,
          },
          {
            path: "/order/:id",
            element: <Order />,
          },
        ],
      },
      // Admin Routes
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          {
            path: "userlist",
            element: <UserList />,
          },
          {
            path: "categorylist",
            element: <CategoryList />,
          },
          {
            path: "productlist/:pageNumber",
            element: <ProductList />,
          },
          {
            path: "allproductslist",
            element: <AllProducts />,
          },
          {
            path: "orderlist",
            element: <OrderList />,
          },
          {
            path: "product/update/:_id",
            element: <ProductUpdate />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
