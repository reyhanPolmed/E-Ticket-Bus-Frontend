import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUser, selectUser, logOut } from "../../features/auth/AuthSlice"
import LogoutPopup from "../LogoutPopup"

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectCurrentUser);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutPopupOpen(true);
    };

    const handleConfirmLogout = () => {
        dispatch(logOut());
        setIsLogoutPopupOpen(false);
        navigate("/login");
    };

    return (
        <>
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] bg-white px-10 py-3 shadow-sm font-display">
                <div className="flex items-center gap-4 text-[#111318]">
                    <Link to="/" className="flex items-center gap-4 text-[#111318] hover:opacity-80 transition-opacity">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined !text-3xl">directions_bus</span>
                        </div>
                        <h2 className="text-[#111318] text-xl font-bold leading-tight tracking-[-0.015em]">BusGo</h2>
                    </Link>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-9">
                        <Link className="text-[#111318] hover:text-primary transition-colors text-sm font-medium leading-normal" to="/">Home</Link>
                        <Link className="text-[#111318] hover:text-primary transition-colors text-sm font-medium leading-normal" to="#">Manage Booking</Link>
                        <Link className="text-[#111318] hover:text-primary transition-colors text-sm font-medium leading-normal" to="#">Help</Link>
                    </div>
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                Hi, {user.firstName || user.email}
                            </span>
                            <button
                                onClick={handleLogoutClick}
                                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-sm font-bold leading-normal tracking-[0.015em]"
                            >
                                <span className="truncate">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Sign In</span>
                        </Link>
                    )}
                </div>
            </header>
            <LogoutPopup
                isOpen={isLogoutPopupOpen}
                onClose={() => setIsLogoutPopupOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </>
    )
}

export default Header
