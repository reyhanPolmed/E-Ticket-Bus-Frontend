"use client"
import React from "react"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] bg-white px-10 py-3 shadow-sm font-display">
            <div className="flex items-center gap-4 text-[#111318]">
                <div className="size-8 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined !text-3xl">directions_bus</span>
                </div>
                <h2 className="text-[#111318] text-xl font-bold leading-tight tracking-[-0.015em]">BusGo</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
                <div className="hidden md:flex items-center gap-9">
                    <Link className="text-[#111318] hover:text-primary transition-colors text-sm font-medium leading-normal" to="/">Home</Link>
                    <Link className="text-[#111318] hover:text-primary transition-colors text-sm font-medium leading-normal" to="#">Manage Booking</Link>
                    <Link className="text-[#111318] hover:text-primary transition-colors text-sm font-medium leading-normal" to="#">Help</Link>
                </div>
                <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Sign In</span>
                </Link>
            </div>
        </header>
    )
}

export default Header
