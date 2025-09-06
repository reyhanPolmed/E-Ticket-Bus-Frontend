import React from "react";
import { useState } from "react";
import { LoginUser } from "../api/authApi";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Function to show the modal
  const showMessage = (msg: string) => {
    setMessage(msg);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Authentication logic goes here
    const response = await LoginUser(email, password)
    const responseBody = await response.json()
    if(response) {
        console.log(responseBody)
        showMessage("Login berhasil! (Ini hanya demo)");
    } else {
        showMessage("login gagal!")
    }
  };
  return (
    <div className="bg-indigo-900 flex items-center justify-center min-h-screen p-4 font-['Roboto_Mono']">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_black] rounded-lg p-8 w-full max-w-sm">
        {/* Header and Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-black text-left">
            LOGIN
          </h1>
          <p className="text-sm text-gray-700">Selamat datang kembali!</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-black mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:border-indigo-500 shadow-[2px_2px_0px_black] transition-all duration-200"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-black mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:border-indigo-500 shadow-[2px_2px_0px_black] transition-all duration-200"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-extrabold py-4 border-4 border-black shadow-[8px_8px_0px_black] rounded-none hover:bg-yellow-300 transition-transform duration-200 hover:shadow-[4px_4px_0px_black] hover:translate-x-[4px] hover:translate-y-[4px]"
          >
            MASUK
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="text-xs text-indigo-500 hover:text-indigo-700 underline font-bold"
          >
            Lupa Password?
          </a>
          <p className="text-sm mt-2 text-gray-700">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-indigo-500 hover:text-indigo-700 font-bold underline"
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </div>

      {/* Message Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_black] p-6 rounded-lg w-full max-w-xs text-center">
            <p className="text-lg font-bold text-black">{message}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-black text-white px-6 py-2 border-2 border-black shadow-[2px_2px_0px_black] hover:bg-gray-800 transition-transform duration-200 hover:shadow-[1px_1px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
