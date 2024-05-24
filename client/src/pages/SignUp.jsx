import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <div className="w-full rounded-lg bg-emerald-50 shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-emerald-700 md:text-2xl">
            Tạo tài khoản
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-emerald-900">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-emerald-900 focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                id="username"
                onChange={handleChange}
                required
              />
            </div>
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
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
            <OAuth />
            <p className="text-sm font-light text-emerald-700">
              Bạn đã có tài khoản?{" "}
              <Link
                to={"/sign-in"}
                className="text-emerald-900 font-medium hover:underline"
                aria-label="Sign In"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </form>
          {error && <p className="mt-5 text-rose-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
