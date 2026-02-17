import type React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 px-10 font-display">
            <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <span className="material-symbols-outlined">directions_bus</span>
                        <span className="text-xl font-bold text-gray-900">BusGo</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Making travel accessible, comfortable, and affordable for everyone. Your journey starts here.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><Link className="hover:text-primary" to="#">About Us</Link></li>
                        <li><Link className="hover:text-primary" to="#">Careers</Link></li>
                        <li><Link className="hover:text-primary" to="#">Press</Link></li>
                        <li><Link className="hover:text-primary" to="#">Blog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><Link className="hover:text-primary" to="#">Help Center</Link></li>
                        <li><Link className="hover:text-primary" to="#">Terms of Service</Link></li>
                        <li><Link className="hover:text-primary" to="#">Privacy Policy</Link></li>
                        <li><Link className="hover:text-primary" to="#">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
                    <div className="flex gap-4 text-gray-400">
                        <Link className="hover:text-primary transition-colors" to="#"><span className="material-symbols-outlined">public</span></Link>
                        <Link className="hover:text-primary transition-colors" to="#"><span className="material-symbols-outlined">share</span></Link>
                        <Link className="hover:text-primary transition-colors" to="#"><span className="material-symbols-outlined">rss_feed</span></Link>
                    </div>
                </div>
            </div>
            <div className="max-w-[1024px] mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                <p>© 2023 BusGo Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link className="hover:text-gray-600" to="#">Privacy</Link>
                    <Link className="hover:text-gray-600" to="#">Terms</Link>
                    <Link className="hover:text-gray-600" to="#">Sitemap</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
