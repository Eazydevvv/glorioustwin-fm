// "use client";
// import { useState } from "react";
// import { useRouter } from "next/router";
// import { API_URL } from "../../utils/api";

// export default function AdminLoginPage() {
//   const r = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setErr(null);
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       if (!res.ok) throw new Error("Invalid credentials");
//       const data = await res.json();
//       localStorage.setItem("token", data.token);
//       r.push("/Admin"); // dashboard
//     } catch (e: any) {
//       setErr(e.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen grid place-items-center p-6">
//       <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl p-6 shadow">
//         <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
//         {err && <p className="text-red-600 mb-3">{err}</p>}
//         <input className="w-full border p-2 rounded mb-3" placeholder="Email"
//                value={email} onChange={e=>setEmail(e.target.value)} />
//         <input className="w-full border p-2 rounded mb-4" placeholder="Password" type="password"
//                value={password} onChange={e=>setPassword(e.target.value)} />
//         <button disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded">
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
