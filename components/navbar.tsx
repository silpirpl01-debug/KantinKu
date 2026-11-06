
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-800 bg-white px-6 py-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold text-pink-600">
          Kantinku
        </Link>

        <div className="flex items-center gap-7 text-base">
          <Link href="/" className="font-semibold text-pink-600">
            Beranda
          </Link>
          <Link href="/menu" className="text-gray-700 hover:text-pink-600">
            Menu
          </Link>
          <Link href="/favorit" className="text-gray-700 hover:text-pink-600">
            Favorit
          </Link>
          <Link href="/Keranjang" className="text-gray-700 hover:text-pink-600">
            Keranjang
          </Link>
          <Link href="/Riwayat" className="text-gray-700 hover:text-pink-600">
            Riwayat
          </Link>
        </div>
      </div>
    </nav>
  );
}
