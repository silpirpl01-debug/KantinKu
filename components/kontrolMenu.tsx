"use client";

import { useState } from "react";
import type { Menu } from "../data/Menu";
import KartuMenu from "./kartuMenu";

export default function KontrolMenu({ data }: { data: Menu[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urutan, setUrutan] = useState("awal");

  const hasil = data
    .filter((item) =>
      item.nama.toLowerCase().includes(cari.toLowerCase())
    )
    .filter(
      (item) =>
        kategori === "Semua" || item.kategori === kategori
    )
    .sort((a, b) => {
      if (urutan === "termurah") {
        return a.harga - b.harga;
      }

      if (urutan === "termahal") {
        return b.harga - a.harga;
      }

      if (urutan === "nama") {
        return a.nama.localeCompare(b.nama);
      }

      return a.id - b.id;
    });

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Cari nama menu..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="rounded-lg border p-3"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Camilan">Camilan</option>
        </select>

        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="awal">Urutan Awal</option>
          <option value="termurah">Harga Termurah</option>
          <option value="termahal">Harga Termahal</option>
          <option value="nama">Nama A-Z</option>
        </select>
      </div>

      <p className="mb-4 text-gray-600">
        {hasil.length} menu ditemukan
      </p>

      {hasil.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          Menu tidak ditemukan
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {hasil.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}