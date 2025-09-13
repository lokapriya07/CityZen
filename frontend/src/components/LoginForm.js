// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useAuth } from "@/lib/auth"
// import { Loader2 } from "lucide-react"

// export function LoginForm() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [role, setRole] = useState("user")
//   const [error, setError] = useState("")
//   const { login, isLoading } = useAuth()
//   const router = useRouter()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")

//     if (!email || !password) {
//       setError("Please fill in all fields")
//       return
//     }

//     const success = await login(email, password, role)
//     if (success) {
//       // Redirect based on role
//       switch (role) {
//         case "admin":
//           router.push("/admin")
//           break
//         case "worker":
//           router.push("/worker")
//           break
//         default:
//           router.push("/")
//           break
//       }
//     } else {
//       setError("Invalid credentials. Please try again.")
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl">Welcome Back</CardTitle>
//         <CardDescription>Sign in to your City Brain account</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="role">Account Type</Label>
//             <Select value={role} onValueChange={(value) => setRole(value)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select your role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="user">Citizen</SelectItem>
//                 <SelectItem value="worker">Waste Worker</SelectItem>
//                 <SelectItem value="admin">Administrator</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Signing in...
//               </>
//             ) : (
//               "Sign In"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Dummy login (replace with real API later)
    if (email === "test@test.com" && password === "1234") {
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "worker":
          navigate("/worker");
          break;
        default:
          navigate("/");
          break;
      }
    } else {
      setError("Invalid credentials. Please try again.");
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

          <div>
            <label>Account Type</label>
            <select
              className="w-full border rounded p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Citizen</option>
              <option value="worker">Waste Worker</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-green-700 font-medium hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}



