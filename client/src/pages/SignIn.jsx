import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <div className="w-full rounded-lg bg-emerald-50 shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-emerald-700 md:text-2xl">
            Đăng nhập
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-emerald-900">
                Email
              </label>
              <input
                type="email"
                placeholder="abc@example.com"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-emerald-900 focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                id="email"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-emerald-900">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-emerald-900 focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                id="password"
                onChange={handleChange}
                required
                autoComplete="on"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-lg bg-emerald-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <OAuth />
            <p className="text-sm font-light text-emerald-700">
              Bạn chưa có tài khoản?{" "}
              <Link
                to={"/sign-up"}
                className="text-emerald-900 font-medium hover:underline"
                aria-label="Sign Up"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
          {error && <p className="text-sm font-bold text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
