import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white mt-8 py-8 px-8 bebas-neue neobrutalism-border">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 className="text-3xl font-bold mb-4 tracking-widest">BUSTICKETS</h3>
                <p className="text-sm">Platform terpercaya untuk pemesanan tiket bus online di Indonesia. Mudah, cepat, dan aman.</p>
                <div className="mt-4 space-y-2 text-sm">
                    <p>+62 21 1234 5678</p>
                    <p>info@busticket.com</p>
                    <p>Jakarta, Indonesia</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4 tracking-widest">LAYANAN</h3>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">Cari Bus</a></li>
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">Rute Populer</a></li>
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">Promo</a></li>
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">Bantuan</a></li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4 tracking-widest">DUKUNGAN</h3>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">Kontak</a></li>
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">Kebijakan</a></li>
                    <li><a href="#" className="hover:text-yellow-400 transition-colors">Syarat & Ketentuan</a></li>
                </ul>
            </div>
        </div>
    </footer>
  )
}

export default Footer
