// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/solid';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-purple-900 to-blue-900 shadow-xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-500/20 rounded-full mix-blend-screen animate-float"></div>
      </div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo with hover animation */}
          <Link 
            to="/" 
            className="group flex items-center space-x-2 transform transition-all duration-300 hover:scale-105"
          >
            <SparklesIcon className="h-8 w-8 text-amber-300 animate-spin-slow group-hover:animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-cyan-300 bg-clip-text text-transparent">
              WebScan
            </span>
          </Link>

          {/* Navigation links with animated underline */}
          <div className="flex items-center space-x-8">
            <NavLink to="/scan" text="New Scan" />
            <NavLink to="/history" text="History" />
            <button className="ml-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-glow hover:shadow-cyan-400/40">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, text }) {
  return (
    <Link 
      to={to} 
      className="relative text-white/90 hover:text-white group transition-all duration-300"
    >
      {text}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-300 transition-all duration-500 group-hover:w-full group-hover:shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]"></span>
    </Link>
  );
}