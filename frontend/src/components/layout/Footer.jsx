// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} WebScan Analytics</p>
      </div>
    </footer>
  )
}