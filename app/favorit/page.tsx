
"use client";

import { useEffect, useState } from "react";
import type { Menu } from "../../data/Menu";
import KartuMenu from "../../components/kartuMenu";

export default function FavoritPage() {
  const [items, setItems] = useState<Menu[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    async function ambilFavorit() {
      try {
        setMemuat(true);
        setGalat("");

        const response = await fetch("/api/menu");

        if (!response.ok) {
          throw new Error("Gagal mengambil data menu.");
        }

        const semuaMenu: Menu[] = await response.json();

        const dataFavorit = localStorage.getItem("favorit");
        const daftarFavorit: number[] = dataFavorit
          ? JSON.parse(dataFavorit)
          : [];

        if (!Array.isArray(daftarFavorit)) {
          throw new Error("Data favorit tidak valid.");
        }

        const hasil = semuaMenu.filter((item) =>
          daftarFavorit.includes(Number(item.id))
        );

        setItems(hasil);
      } catch {
        setGalat("Gagal memuat menu favorit. Silakan coba lagi.");
      } finally {
        setMemuat(false);
      }
    }

    ambilFavorit();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Menu Favorit
      </h1>

      {memuat ? (
        <p className="py-10 text-center text-gray-500">
          Memuat ...
        </p>
      ) : galat ? (
        <p className="py-10 text-center text-red-600">
          {galat}
        </p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          Belum ada menu favorit.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
