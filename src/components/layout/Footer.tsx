import type React from "react"
import { Bus, Mail, Phone, MapPin } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Bus className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">BusTicket</span>
            </div>
            <p className="text-gray-300 mb-4">
              Platform terpercaya untuk pemesanan tiket bus online di Indonesia. Mudah, cepat, dan aman.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone size={16} />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail size={16} />
                <span>info@busticket.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cari Bus
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Rute Populer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Promo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bantuan
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kontak
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kebijakan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BusTicket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
