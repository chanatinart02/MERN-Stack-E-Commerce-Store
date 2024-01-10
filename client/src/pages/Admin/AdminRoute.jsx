import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

import Loader from "../../components/Loader";
import Message from "../../components/Message";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Must auth and be admin if not go to login
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
