
"use client";

import { useState } from "react";
import { tambahItem } from "../lib/cart";

type Props = {
  id: string | number;
  nama: string;
  harga: number;
  stok: number;
  gambar?: string;
};

export default function TambahKeKeranjang({
  id,
  nama,
  harga,
  stok,
  gambar,
}: Props) {
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");

  const formatRupiah = (nilai: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nilai);

  const totalHarga = jumlah > 0 ? harga * jumlah : 0;

  function handleTambah() {
    if (!Number.isInteger(jumlah) || jumlah < 1) {
      setPesan("Jumlah minimal 1.");
      return;
    }

    if (jumlah > stok) {
      setPesan(`Jumlah tidak boleh melebihi stok ${stok}.`);
      return;
    }

    const hasil = tambahItem(
      { id, nama, harga, stok, gambar },
      jumlah
    );

    setPesan(hasil.pesan);

    if (hasil.sukses) {
      setJumlah(1);
    }
  }

  if (stok <= 0) {
    return (
      <div className="mt-5 space-y-3">
        <p className="font-semibold text-gray-500">
          Menu ini habis.
        </p>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3 font-semibold text-gray-500"
        >
          Stok Habis
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div>
        <label className="mb-2 block font-medium">
          Jumlah:
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setJumlah((j) => Math.max(1, j - 1));
              setPesan("");
            }}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            −
          </button>

          <input
            type="number"
            min={1}
            max={stok}
            step={1}
            value={jumlah}
            onChange={(e) => {
              setJumlah(
                e.target.value === "" ? 0 : Number(e.target.value)
              );
              setPesan("");
            }}
            className="w-20 rounded-lg border p-2 text-center"
          />

          <button
            type="button"
            disabled={jumlah >= stok}
            onClick={() => {
              setJumlah((j) => Math.min(stok, j + 1));
              setPesan("");
            }}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Stok tersedia: {stok}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-gray-600">
          Harga satuan: {formatRupiah(harga)}
        </p>

        <p className="mt-2 text-lg font-bold text-pink-600">
          Total harga: {formatRupiah(totalHarga)}
        </p>
      </div>

      <button
        type="button"
        onClick={handleTambah}
        className="rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700"
      >
        Tambah ke Keranjang
      </button>

      {pesan && (
        <p className="text-sm font-medium text-blue-700">
          {pesan}
        </p>
      )}
    </div>
  );
}
