import React, { useState } from "react";
import { RegisterUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../features/ui/uiSlice";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
}

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!firstName.trim()) {
      newErrors.firstName = "Nama depan wajib diisi.";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "Nama depan minimal 2 karakter.";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Nama belakang wajib diisi.";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Nama belakang minimal 2 karakter.";
    }
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
    if (!phone.trim()) {
      newErrors.phone = "Nomor WhatsApp wajib diisi.";
    } else if (!/^\d{10,15}$/.test(phone.replace(/[\s\-+]/g, ""))) {
      newErrors.phone = "Nomor WhatsApp harus 10-15 digit angka.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await RegisterUser(email, firstName, lastName, password, phone);
      const responseBody = response.data;
      if (responseBody.success === true || responseBody.status === true || responseBody.status === "success") {
        dispatch(showToast({ message: "Registrasi berhasil! Silakan login.", type: "success" }));
        navigate("/login");
      } else {
        dispatch(showToast({ message: "Registrasi gagal! Silakan coba lagi.", type: "error" }));
      }
    } catch (error: any) {
      console.error("Register error:", error);
      dispatch(
        showToast({
          message: error.response?.data?.message || "Registrasi gagal! Silakan coba lagi.",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (
    id: string,
    label: string,
    icon: string,
    value: string,
    onChange: (val: string) => void,
    type: string = "text",
    placeholder: string = "",
    error?: string
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-gray-400 !text-xl">{icon}</span>
        </div>
        {id === "password" ? (
          <>
            <input
              type={showPassword ? "text" : type}
              id={id}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                clearError(id as keyof FormErrors);
              }}
              className={`w-full pl-10 pr-12 py-3 rounded-xl border ${error ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-primary/20 focus:border-primary"
                } bg-white text-sm outline-none focus:ring-4 transition-all placeholder:text-gray-400`}
              placeholder={placeholder}
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
          </>
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              clearError(id as keyof FormErrors);
            }}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${error ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-primary/20 focus:border-primary"
              } bg-white text-sm outline-none focus:ring-4 transition-all placeholder:text-gray-400`}
            placeholder={placeholder}
          />
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <span className="material-symbols-outlined !text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );

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
            <h1 className="text-2xl font-bold text-[#111318] mb-1">Buat Akun Baru</h1>
            <p className="text-gray-500 text-sm">Daftar untuk mulai memesan tiket bus.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              {renderField("firstName", "Nama Depan", "person", firstName, setFirstName, "text", "Nama depan", errors.firstName)}
              {renderField("lastName", "Nama Belakang", "badge", lastName, setLastName, "text", "Nama belakang", errors.lastName)}
            </div>

            {renderField("email", "Email", "mail", email, setEmail, "email", "nama@email.com", errors.email)}
            {renderField("password", "Password", "lock", password, setPassword, "password", "Minimal 6 karakter", errors.password)}
            {renderField("phone", "Nomor WhatsApp", "phone_android", phone, setPhone, "tel", "08xxxxxxxxxx", errors.phone)}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin !text-xl">refresh</span>
                  Memproses...
                </>
              ) : (
                <>
                  Daftar
                  <span className="material-symbols-outlined !text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary hover:text-blue-700 font-semibold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Dengan mendaftar, Anda menyetujui <a href="#" className="underline hover:text-gray-500">Syarat & Ketentuan</a> kami.
        </p>
      </div>
    </div>
  );
};

export default Register;
