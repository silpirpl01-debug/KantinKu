
import Link from "next/link";
import { rupiah, type Menu } from "../data/Menu";
import TambahFavorit from "./tambahfavorit";

export default function KartuMenu({ item }: { item: Menu }) {
  const habis = item.stok <= 0;

  return (
    <div
      className={`rounded-lg border p-5 shadow-sm transition ${
        habis
          ? "border-gray-300 bg-gray-100"
          : "border-gray-200 bg-white hover:shadow-lg"
      }`}
    >
      <h3
        className={`text-lg font-bold ${
          habis ? "text-gray-500" : "text-gray-800"
        }`}
      >
        {item.nama}
      </h3>

      <p className={`mt-2 ${habis ? "text-gray-400" : "text-gray-600"}`}>
        Kategori: {item.kategori}
      </p>

      <p
        className={`mt-2 font-bold ${
          habis ? "text-gray-500" : "text-pink-500"
        }`}
      >
        {rupiah(item.harga)}
      </p>

      <p
        className={`mt-2 font-semibold ${
          habis ? "text-gray-500" : "text-green-600"
        }`}
      >
        {habis ? "Habis" : `Stok: ${item.stok}`}
      </p>

      <div className="mt-3">
        <TambahFavorit id={item.id} />
      </div>

      <Link
        href={`/menu/${item.id}`}
        className={`mt-4 inline-block rounded px-4 py-2 text-white ${
          habis
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        Lihat Detail
      </Link>
    </div>
  );
}
