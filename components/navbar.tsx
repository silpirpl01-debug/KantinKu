
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getKeranjang } from "../lib/cart";

export default function Navbar() {
  const pathname = usePathname();
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    function hitung() {
      const items = getKeranjang();
      const total = items.reduce(
        (hasil, item) => hasil + item.jumlah,
        0
      );

      setJumlah(total);
    }

    hitung();

    window.addEventListener("keranjang-berubah", hitung);
    window.addEventListener("storage", hitung);

    return () => {
      window.removeEventListener("keranjang-berubah", hitung);
      window.removeEventListener("storage", hitung);
    };
  }, []);

  const menu = [
    { nama: "Beranda", href: "/" },
    { nama: "Menu", href: "/menu" },
    { nama: "Favorit", href: "/favorit" },
    { nama: "Keranjang", href: "/keranjang" },
    { nama: "Riwayat", href: "/riwayat" },
  ];

  return (
    <nav className="w-full border-b border-gray-800 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center gap-8">
        <Link href="/" className="text-xl font-bold text-pink-600">
          Kantinku
        </Link>

        <div className="flex flex-wrap items-center gap-7 text-base">
          {menu.map((item) => {
            const aktif = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  aktif
                    ? "font-semibold text-pink-600"
                    : "text-gray-700 hover:text-pink-600"
                }
              >
                {item.nama}

                {item.href === "/keranjang" && jumlah > 0 && (
                  <span className="ml-1 rounded-full bg-pink-600 px-2 py-1 text-xs text-white">
                    {jumlah}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
