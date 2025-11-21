"use client"

import React from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logOut } from "../../features/user/AuthSlice" 
const Header: React.FC = () => {
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logOut())
    }
    return (
    <header className="bg-black text-white py-4 px-8 bebas-neue neobrutalism-border z-30">
        <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold tracking-widest">BUSTICKETS</Link>
            <nav className="space-x-8 text-xl">
                <Link to="/" className="hover:text-yellow-400 transition-colors">BERANDA</Link>
                <Link to="/" className="hover:text-yellow-400 transition-colors">CARI BUS</Link>
                <button className="hover:text-yellow-400 transition-colors" onClick={handleLogout}>LOGOUT</button>
            </nav>
        </div>
    </header>
     )
}

export default Header
