
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getKeranjang,
  simpanKeranjang,
} from "../../lib/cart";
import type { CartItem } from "../../lib/cart";

type RiwayatPesanan = {
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

export default function KeranjangPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [kodePromo, setKodePromo] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [pesan, setPesan] = useState("");
  const [pesanPromo, setPesanPromo] = useState("");

  const [caraAmbil, setCaraAmbil] = useState("sendiri");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [pesanOrder, setPesanOrder] = useState("");
  const [struk, setStruk] = useState<RiwayatPesanan | null>(null);

  useEffect(() => {
    function perbaruiKeranjang() {
      setItems(getKeranjang());
    }

    perbaruiKeranjang();

    window.addEventListener("keranjang-berubah", perbaruiKeranjang);
    window.addEventListener("storage", perbaruiKeranjang);

    return () => {
      window.removeEventListener("keranjang-berubah", perbaruiKeranjang);
      window.removeEventListener("storage", perbaruiKeranjang);
    };
  }, []);

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);

  const subtotal = items.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );

  const diskon =
    promoAktif && subtotal >= 20000
      ? Math.round(subtotal * 0.1)
      : 0;

  const ongkir = caraAmbil === "antar" ? 2000 : 0;
  const total = subtotal - diskon + ongkir;

  function perbaruiIsiKeranjang(hasil: CartItem[]) {
    const subtotalBaru = hasil.reduce(
      (total, item) => total + item.harga * item.jumlah,
      0
    );

    setItems(hasil);
    simpanKeranjang(hasil);
    setPesan("");

    if (promoAktif && subtotalBaru < 20000) {
      setPromoAktif(false);
      setPesanPromo(
        "Promo HEMATIO dibatalkan karena subtotal kurang dari Rp20.000."
      );
    }
  }

  function handleJumlah(item: CartItem, jumlah: number) {
    if (jumlah > item.stok) {
      setPesan(`Stok ${item.nama} hanya ${item.stok}.`);
      return;
    }

    if (jumlah < 1) return;

    const hasil = items.map((barang) =>
      String(barang.id) === String(item.id)
        ? { ...barang, jumlah }
        : barang
    );

    perbaruiIsiKeranjang(hasil);
  }

  function handleHapus(id: string | number) {
    const hasil = items.filter(
      (item) => String(item.id) !== String(id)
    );

    perbaruiIsiKeranjang(hasil);
  }

  function handlePromo() {
    const kode = kodePromo.trim().toUpperCase();

    if (kode !== "HEMATIO") {
      setPromoAktif(false);
      setPesanPromo("Kode promo tidak dikenal.");
      return;
    }

    if (subtotal < 20000) {
      setPromoAktif(false);
      setPesanPromo(
        "Promo HEMATIO butuh belanja minimal Rp20.000."
      );
      return;
    }

    setPromoAktif(true);
    setPesanPromo("Promo HEMATIO dipakai: diskon 10%.");
  }

  function handlePesan() {
    if (nama.trim().length < 3) {
      setPesanOrder("Nama pemesan minimal 3 karakter.");
      return;
    }

    if (caraAmbil === "antar" && kelas.trim().length < 3) {
      setPesanOrder("Kelas harus diisi minimal 3 karakter.");
      return;
    }

    if (items.length === 0) {
      setPesanOrder("Keranjang masih kosong.");
      return;
    }

    let riwayatLama: RiwayatPesanan[] = [];

    try {
      const dataLama = localStorage.getItem("riwayat");
      const hasil = dataLama ? JSON.parse(dataLama) : [];

      if (!Array.isArray(hasil)) {
        throw new Error("Data riwayat tidak valid.");
      }

      riwayatLama = hasil;
    } catch {
      setPesanOrder("Data riwayat gagal dibaca.");
      return;
    }

    const idBaru =
      riwayatLama.reduce(
        (terbesar, pesanan) =>
          Math.max(terbesar, Number(pesanan.id) || 0),
        0
      ) + 1;

    const pesananBaru: RiwayatPesanan = {
      id: idBaru,
      tanggal: new Date().toISOString(),
      namaPemesan: nama.trim(),
      kelas: caraAmbil === "antar" ? kelas.trim() : "",
      caraAmbil,
      items: [...items],
      subtotal,
      diskon,
      ongkir,
      total,
    };

    try {
      localStorage.setItem(
        "riwayat",
        JSON.stringify([...riwayatLama, pesananBaru])
      );

      window.dispatchEvent(new Event("riwayat-berubah"));
    } catch {
      setPesanOrder("Pesanan gagal disimpan. Silakan coba lagi.");
      return;
    }

    setStruk(pesananBaru);
    setItems([]);
    simpanKeranjang([]);

    setNama("");
    setKelas("");
    setKodePromo("");
    setPromoAktif(false);
    setPesanPromo("");
    setCaraAmbil("sendiri");
    setPesan("");
    setPesanOrder("");
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Keranjang Belanja
      </h1>

      {struk && (
        <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-6">
          <h2 className="text-xl font-bold text-green-700">
            Terima kasih, {struk.namaPemesan}!
          </h2>

          <p className="mt-2 text-gray-700">
            Pesanan kamu berhasil disimpan.
          </p>

          <div className="mt-4 space-y-2 border-t border-green-200 pt-4">
            {struk.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.nama} x{item.jumlah}
                </span>

                <span>
                  {formatRupiah(item.harga * item.jumlah)}
                </span>
              </div>
            ))}

            <div className="flex justify-between border-t pt-3">
              <span>Subtotal</span>
              <span>{formatRupiah(struk.subtotal)}</span>
            </div>

            {struk.diskon > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Diskon</span>
                <span>- {formatRupiah(struk.diskon)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>
                {struk.caraAmbil === "antar"
                  ? `Ongkir antar ke ${struk.kelas}`
                  : "Diambil sendiri di kantin"}
              </span>

              <span>{formatRupiah(struk.ongkir)}</span>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total bayar</span>
              <span>{formatRupiah(struk.total)}</span>
            </div>
          </div>

          <Link
            href="/riwayat"
            className="mt-5 inline-block font-semibold text-green-700 underline"
          >
            Lihat Riwayat Pesanan
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="mb-4 text-gray-600">
            Keranjang masih kosong.
          </p>

          <Link
            href="/menu"
            className="inline-block rounded-lg bg-pink-600 px-5 py-3 text-white hover:bg-pink-700"
          >
            Lihat Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <h2 className="font-semibold">{item.nama}</h2>

                  <p className="text-sm text-gray-500">
                    {formatRupiah(item.harga)} / item
                  </p>

                  <p className="mt-1 text-sm">
                    Subtotal:{" "}
                    <strong>
                      {formatRupiah(item.harga * item.jumlah)}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={item.jumlah <= 1}
                    onClick={() =>
                      handleJumlah(item, item.jumlah - 1)
                    }
                    className="rounded border px-3 py-1 disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="min-w-6 text-center">
                    {item.jumlah}
                  </span>

                  <button
                    type="button"
                    disabled={item.jumlah >= item.stok}
                    onClick={() =>
                      handleJumlah(item, item.jumlah + 1)
                    }
                    className="rounded border px-3 py-1 disabled:opacity-40"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => handleHapus(item.id)}
                    className="ml-2 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pesan && (
            <p className="mt-3 text-sm text-red-600">
              {pesan}
            </p>
          )}

          <div className="mt-6 rounded-lg border p-5">
            <h2 className="mb-3 font-bold">Kode Promo</h2>

            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Masukkan kode promo"
                value={kodePromo}
                onChange={(e) => setKodePromo(e.target.value)}
                className="min-w-0 flex-1 rounded border p-3"
              />

              <button
                type="button"
                onClick={handlePromo}
                className="rounded-lg bg-pink-600 px-5 py-3 text-white hover:bg-pink-700"
              >
                Pakai
              </button>
            </div>

            {pesanPromo && (
              <p className="mt-2 text-sm text-blue-700">
                {pesanPromo}
              </p>
            )}
          </div>

          <div className="mt-6 rounded-lg border p-5">
            <h2 className="mb-4 font-bold">Cara Ambil</h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                aria-pressed={caraAmbil === "sendiri"}
                onClick={() => setCaraAmbil("sendiri")}
                className={`rounded-lg border p-4 text-left transition ${
                  caraAmbil === "sendiri"
                    ? "border-pink-600 bg-pink-50 text-pink-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-pink-400"
                }`}
              >
                <p className="font-semibold">Ambil Sendiri</p>
                <p className="text-sm">Gratis</p>
              </button>

              <button
                type="button"
                aria-pressed={caraAmbil === "antar"}
                onClick={() => setCaraAmbil("antar")}
                className={`rounded-lg border p-4 text-left transition ${
                  caraAmbil === "antar"
                    ? "border-pink-600 bg-pink-50 text-pink-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-pink-400"
                }`}
              >
                <p className="font-semibold">Diantar</p>
                <p className="text-sm">+Rp2.000</p>
              </button>
            </div>

            {caraAmbil === "antar" && (
              <div className="mt-4">
                <label className="mb-2 block font-medium">
                  Kelas
                </label>

                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: XII RPL 1"
                  className="w-full rounded-lg border p-3"
                />
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg border p-5">
            <h2 className="mb-4 font-bold">Data Pemesan</h2>

            <label className="mb-2 block font-medium">
              Nama Pemesan
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama pemesan"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="mt-6 space-y-3 rounded-lg border p-5">
            <h2 className="mb-3 font-bold">Rincian Pembayaran</h2>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>

            {diskon > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span>
                <span>- {formatRupiah(diskon)}</span>
              </div>
            )}

            {caraAmbil === "antar" && (
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>{formatRupiah(ongkir)}</span>
              </div>
            )}

            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total Bayar</span>
              <span>{formatRupiah(total)}</span>
            </div>

            <button
              type="button"
              onClick={handlePesan}
              className="w-full rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700"
            >
              Pesan Sekarang
            </button>

            {pesanOrder && (
              <p className="text-sm font-medium text-red-600">
                {pesanOrder}
              </p>
            )}
          </div>
        </>
      )}
    </main>
  );
}
