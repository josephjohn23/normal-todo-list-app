// pages/login.tsx

'use client'  
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // install with: npm install js-cookie

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'user' && password === 'password') {
      // Set a cookie for server-side middleware to read
      Cookies.set('auth', 'true', { expires: 1 }); // expires in 1 day
      router.push('/protected');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

