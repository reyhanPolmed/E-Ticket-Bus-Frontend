"use client"

import React from "react"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
  const navigation = [
    { name: "Beranda", href: "/", current: location.pathname === "/" },
    { name: "Cari Bus", href: "/search", current: location.pathname === "/search" },
  ]

    return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">BusTicket</span>
          </Link>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
        </div>
      </div>
    </header>
     )

}

export default Header
