import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import store from "./redux/store";
import { Provider } from "react-redux";

// Auth
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

// Private Route
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/User/Profile.jsx";

// Admin Routes
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
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
        ],
      },
      // Admin Routes
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          {
            path: "userList",
            element: <UserList />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
