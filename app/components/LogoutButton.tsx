"use client"; // Marks this file as a Client Component so it can use browser-only APIs

import Cookies from "js-cookie"; // Small utility to read/write/remove cookies in the browser
import { useRouter } from "next/navigation"; // Next.js client router for navigation and refresh

export default function LogoutButton() {
  // Get a router instance to programmatically navigate after logout
  const router = useRouter();

  // Called when the user clicks the Logout button
  const handleLogout = () => {
    // Remove the auth cookie so the app considers the user logged out
    Cookies.remove("auth", { path: "/" });
    // Send the user back to the home (login) page
    router.push("/");
    // Ask Next.js to revalidate client-side data and UI
    router.refresh();
  };

  return (
    // A simple button that triggers the logout handler
    <button type="button" onClick={handleLogout} className="link cursor-pointer">
      Logout
    </button>
  );
}
