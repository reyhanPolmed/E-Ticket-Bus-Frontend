import React, { useState } from "react";
import { LoginUser } from "../api/authApi";
import { setCredential } from "../features/auth/AuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../features/ui/uiSlice";

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!password.trim()) {
      newErrors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await LoginUser(email, password);
      const responseBody = response.data;
      if (responseBody.status === true || responseBody.success === true) {
        dispatch(setCredential({ data: responseBody.data }));
        dispatch(showToast({ message: "Login berhasil! Selamat datang kembali.", type: "success" }));
        navigate("/");
      } else {
        dispatch(showToast({ message: "Login gagal! Periksa kembali kredensial Anda.", type: "error" }));
      }
    } catch (error: any) {
      console.error("Login error:", error);
      dispatch(
        showToast({
          message: error.response?.data?.message || "Login gagal! Silakan coba lagi.",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-4 font-display">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 text-primary bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined !text-2xl">directions_bus</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111318] tracking-tight">BusGo</h2>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#111318] mb-1">Masuk ke Akun</h1>
            <p className="text-gray-500 text-sm">Selamat datang kembali! Masuk untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 !text-xl">mail</span>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-primary/20 focus:border-primary"
                    } bg-white text-sm outline-none focus:ring-4 transition-all placeholder:text-gray-400`}
                  placeholder="nama@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined !text-sm">error</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 !text-xl">lock</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-primary/20 focus:border-primary"
                    } bg-white text-sm outline-none focus:ring-4 transition-all placeholder:text-gray-400`}
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined !text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined !text-sm">error</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary hover:text-blue-700 font-medium transition-colors">
                Lupa Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin !text-xl">refresh</span>
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <span className="material-symbols-outlined !text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary hover:text-blue-700 font-semibold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Dengan masuk, Anda menyetujui <a href="#" className="underline hover:text-gray-500">Syarat & Ketentuan</a> kami.
        </p>
      </div>
    </div>
  );
};

export default Login;
