import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("https://cityzen-50ug.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Login failed.");
            }

            // --- Extract token based on possible key names ---
            const token =
                data.token || data.authToken || data.workerToken || data.adminToken;

            if (data.user && token) {
                const role = data.user.role;

                // Save in context
                login(data.user, token);

                // Save token & user based on role
                switch (role) {
                    case "admin":
                        localStorage.setItem("adminToken", token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        navigate("/admin");
                        break;

                    case "worker":
                        localStorage.setItem("workerToken", token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        navigate("/worker");
                        break;

                    default:
                        localStorage.setItem("authToken", token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        navigate("/citizen");
                        break;
                }
            } else {
                throw new Error("Login response missing user data or token.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md mx-auto border p-6 rounded shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center text-green-700">
                    Welcome Back
                </h2>
                <p className="text-center mb-4">Sign in to your CityZen account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Email</label>
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
                        <label className="block mb-1">Password</label>
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
