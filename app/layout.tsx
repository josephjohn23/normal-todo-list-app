import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todo list app',
  description: 'Cool todo list app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
          <header style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Cool Todolist</h1>
            <nav style={{ marginTop: '10px' }}>
              <ul style={{ display: 'flex', gap: '16px' }}>
                <li><a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Home</a></li>
                <li><a href="/protected" style={{ color: 'blue', textDecoration: 'underline' }}>Protected Page</a></li>
              </ul>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  )
} 
