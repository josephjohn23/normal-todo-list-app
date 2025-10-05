// pages/login.tsx — Simple demo login page that writes an auth cookie

"use client"; // Client Component because we use state, router, and cookies
import { useState } from "react"; // React state for form inputs
import { useRouter } from "next/navigation"; // Client-side navigation
import Cookies from "js-cookie"; // Cookie helper (installed via: npm install js-cookie)

export default function LoginPage() {
  // Track the username/password entered by the user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Router used to navigate after successful login
  const router = useRouter();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form navigation
    if (username === "user" && password === "password") {
      // Set a cookie so middleware can treat the user as authenticated
      Cookies.set("auth", "true", { expires: 1 }); // Cookie expires in 1 day
      // Go to the protected page after "login"
      router.push("/protected");
    } else {
      // Very simple demo validation
      alert("Invalid credentials");
    }
  };

  return (
    // Centered card with a basic sign-in form
    <section className="w-full min-h-[70vh] grid place-items-center py-10">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-subtitle">Use demo credentials: user / password</p>
        <div className="grid gap-2 mb-3">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="auth-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2 mb-3">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between gap-3 mt-4">
          <button className="auth-button" type="submit">
            Log in
          </button>
        </div>
      </form>
    </section>
  );
}
