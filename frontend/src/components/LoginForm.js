// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:8001/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.msg || "Login failed.");
//       }

//       // --- Save user & token in AuthContext + localStorage ---
//       if (data.user && data.token) {
//         login(data.user, data.token);
//         localStorage.setItem("workerToken", data.token);
//         localStorage.setItem("workerUser", JSON.stringify(data.user));
//       } else {
//         throw new Error("Login response missing user data or token.");
//       }

//       // --- Navigate based on role ---
//       switch (data.user.role) {
//         case "admin":
//           navigate("/admin");
//           break;
//         case "worker":
//           navigate("/worker");
//           break;
//         default:
//           navigate("/citizen");
//           break;
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md mx-auto border p-6 rounded shadow-lg bg-white">
//         <h2 className="text-2xl font-bold text-center text-green-700">Welcome Back</h2>
//         <p className="text-center mb-4">Sign in to your CityZen account</p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1">Email</label>
//             <input
//               className="w-full border rounded p-2"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1">Password</label>
//             <input
//               className="w-full border rounded p-2"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && <div className="text-red-500 text-sm">{error}</div>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

//         <p className="mt-4 text-sm text-center">
//           Don&apos;t have an account?{" "}
//           <a
//             href="/signup"
//             className="text-green-700 font-medium hover:underline"
//           >
//             Sign up here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
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
            const response = await fetch("http://localhost:8001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Login failed.");
            }

            // --- Save user & token in AuthContext + localStorage ---
            if (data.user && data.token) {
                login(data.user, data.token);

                // --- THIS IS THE FIX ---
                // Save the token with the key 'authToken' to match what fetchApi is looking for
                localStorage.setItem("authToken", data.token);
                // ---------------------

                // You can keep this or remove it, but 'authToken' is the important one
                localStorage.setItem("workerUser", JSON.stringify(data.user));
            } else {
                throw new Error("Login response missing user data or token.");
            }

            // --- Navigate based on role ---
            switch (data.user.role) {
                case "admin":
                    navigate("/admin");
                    break;
                case "worker":
                    navigate("/worker");
                    break;
                default:
                    navigate("/citizen");
                    break;
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
                <h2 className="text-2xl font-bold text-center text-green-700">Welcome Back</h2>
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