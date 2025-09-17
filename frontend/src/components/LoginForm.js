import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Import the useAuth hook

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 Get the login function from your context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    setLoading(true);

    try {
      // --- API Call to Backend Login Endpoint ---
      const response = await fetch("http://localhost:8001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed.");
      }

      // --- If login is successful ---
      // 1. Save user to global context + localStorage
      login(data.user);

      // 2. Navigate based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "worker") {
        navigate("/worker");
      } else {
        navigate("/citizen"); // citizen → homepage
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto border p-6 rounded shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-center text-green-700">Welcome Back</h2>
        <p className="text-center mb-4">Sign in to your CityZen account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              className="w-full border rounded p-2"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              className="w-full border rounded p-2"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-green-700 font-medium hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
