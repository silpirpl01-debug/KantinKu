
"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import type { CartItem } from "../../lib/cart";

type Pesanan = {
  id: number;
  tanggal: string;
  namaPemesan: string;
  kelas: string;
  caraAmbil: string;
  items: CartItem[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("riwayat-berubah", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("riwayat-berubah", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem("riwayat") || "[]";
}

function getServerSnapshot() {
  return "[]";
}

export default function RiwayatPage() {
  const data = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const riwayat = useMemo<Pesanan[]>(() => {
    try {
      const hasil = JSON.parse(data);

      if (!Array.isArray(hasil)) return [];

      return [...hasil].sort(
        (a, b) =>
          new Date(b.tanggal).getTime() -
          new Date(a.tanggal).getTime()
      );
    } catch {
      return [];
    }
  }, [data]);

  const rupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);

  const totalBelanja = riwayat.reduce(
    (total, pesanan) => total + pesanan.total,
    0
  );

  const jumlahMenu = (pesanan: Pesanan) =>
    pesanan.items.reduce(
      (total, item) => total + item.jumlah,
      0
    );

  function handleHapusRiwayat() {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus semua riwayat pesanan?"
    );

    if (!yakin) return;

    localStorage.removeItem("riwayat");
    window.dispatchEvent(new Event("riwayat-berubah"));
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Riwayat Pesanan
      </h1>

      {riwayat.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="mb-4 text-gray-600">
            Belum ada pesanan.
          </p>

          <Link
            href="/menu"
            className="inline-block rounded-lg bg-pink-600 px-5 py-3 text-white"
          >
            Lihat Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-xl border bg-pink-50 p-5">
            <h2 className="mb-3 font-bold text-gray-800">
              Ringkasan Riwayat
            </h2>

            <div className="flex justify-between">
              <span>Jumlah pesanan</span>
              <strong>{riwayat.length} pesanan</strong>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Total belanja</span>
              <strong className="text-pink-600">
                {rupiah(totalBelanja)}
              </strong>
            </div>

            <button
              type="button"
              onClick={handleHapusRiwayat}
              className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Hapus Semua Riwayat
            </button>
          </div>

          <div className="space-y-5">
            {riwayat.map((pesanan) => (
              <div
                key={pesanan.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="mb-4 border-b pb-3">
                  <h2 className="text-lg font-bold">
                    Pesanan #{pesanan.id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(pesanan.tanggal).toLocaleString("id-ID")}
                  </p>

                  <p className="mt-2">
                    Pemesan: <strong>{pesanan.namaPemesan}</strong>
                  </p>

                  <p className="text-sm text-gray-600">
                    Jumlah menu: {jumlahMenu(pesanan)}
                  </p>
                </div>

                <div className="space-y-3">
                  {pesanan.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3"
                    >
                      <span>
                        {item.nama} x {item.jumlah}
                      </span>

                      <span>
                        {rupiah(item.harga * item.jumlah)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{rupiah(pesanan.subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Diskon</span>
                    <span className="text-green-600">
                      - {rupiah(pesanan.diskon)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Ongkir</span>
                    <span>{rupiah(pesanan.ongkir)}</span>
                  </div>

                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total Bayar</span>
                    <span className="text-pink-600">
                      {rupiah(pesanan.total)}
                    </span>
                  </div>

                  <p className="pt-2 text-sm text-gray-600">
                    Cara ambil:{" "}
                    {pesanan.caraAmbil === "antar"
                      ? `Diantar ke ${pesanan.kelas}`
                      : "Ambil sendiri di kantin"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
