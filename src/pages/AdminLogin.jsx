import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef(null);

  const USER = "rockyitservices";
  const PASS = "nopassword";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) return setError("Please enter username and password");
    if (username === USER && password === PASS) {
      localStorage.setItem("adminAuth", "true");
      if (remember) localStorage.setItem("adminUser", username);
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid credentials — please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-xl font-bold">R</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Rocky IT Services</h1>
              <p className="text-sm text-gray-500">Admin Console — sign in to continue</p>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Admin login form">
            <label className="block">
              <span className="text-sm text-gray-600">Username</span>
              <div className="mt-1 relative">
                <input
                  ref={userRef}
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  placeholder=""
                  aria-label="username"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Password</span>
              <div className="mt-1 relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  placeholder=""
                  aria-label="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} className="form-checkbox" />
                Remember me
              </label>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow">Sign In</button>
            </div>
          </form>

          <div className="mt-6 text-xs text-gray-500">
            Use the admin credentials provided by the owner. This page uses a simple client-side guard.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
