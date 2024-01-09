import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import Loader from "../../components/Loader";

const Login = () => {
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redux hooks to dispatch actions and select data from the store
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Use generated login mutation from API slice
  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();

  // Custom hook to get query parameters from the URL
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    //   check if the user is already authenticated, if so, redirect
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Call the login mutation and unwrap the result
      const res = await login({ email, password }).unwrap();
      console.log(res);
      // action to set res to userInfo in localStorage
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <section className="flex h-screen">
      <div className="flex flex-1  justify-center items-center flex-col px-10 lg:ml-10">
        <h1 className="text-2xl font-semibold mt-4">Sign In</h1>

        <form onSubmit={submitHandler} className="container w-[40rem]">
          <div className="my-[2rem]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem] w-full"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {/* Display loader while loading */}
          {isLoading && <Loader />}
        </form>

        {/* Link to register page */}
        <div className="mt-4">
          <p className="text-white">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
      {/* Right image */}
      <img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
        alt=""
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </section>
  );
};

export default Login;
