import React from "react";
import { useState } from "react";
import { RegisterUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate()
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
    try {
      const response = await RegisterUser(email, firstName, lastName, password, phone);
      const responseBody = response.data;
      if (responseBody.success === true || responseBody.status === true || responseBody.status === "success") {
        console.log(responseBody);
        showMessage("Registrasi berhasil!");
        navigate("/login");
      } else {
        showMessage("Register gagal!");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      showMessage(error.response?.data?.message || "Register gagal!");
    }
  };

  return (
    <div className="bg-indigo-900 flex items-center justify-center min-h-screen p-4 font-['Roboto_Mono']">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_black] rounded-lg p-8 w-full max-w-sm">
        {/* Header dan Judul */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-black text-left">
            DAFTAR
          </h1>
          <p className="text-sm text-gray-700">Buat akun baru Anda!</p>
        </div>

        {/* Formulir Registrasi */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama Depan */}
          <div>
            <label
              htmlFor="nama depan"
              className="block text-sm font-bold text-black mb-2"
            >
              Nama Depan
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:border-indigo-500 shadow-[2px_2px_0px_black] transition-all duration-200"
              required
            />
          </div>

          {/* Input Nama Belakang */}
          <div>
            <label
              htmlFor="nama belakang"
              className="block text-sm font-bold text-black mb-2"
            >
              Nama Belakang
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:border-indigo-500 shadow-[2px_2px_0px_black] transition-all duration-200"
              required
            />
          </div>
          {/* Input Email */}
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

          {/* Input Password */}
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

          {/* Input Nomor Hp */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-black mb-2"
            >
              Nomor Whatshapp
            </label>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:border-indigo-500 shadow-[2px_2px_0px_black] transition-all duration-200"
              required
            />
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-extrabold py-4 border-4 border-black shadow-[8px_8px_0px_black] rounded-none hover:bg-yellow-300 transition-transform duration-200 hover:shadow-[4px_4px_0px_black] hover:translate-x-[4px] hover:translate-y-[4px]"
          >
            DAFTAR
          </button>
        </form>

        {/* Link Tambahan */}
        <div className="mt-8 text-center">
          <p className="text-sm mt-2 text-gray-700">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-indigo-500 hover:text-indigo-700 font-bold underline"
            >
              Masuk di sini
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

export default Register;
