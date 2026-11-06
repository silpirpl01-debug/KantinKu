import Link from "next/link";
import { Menu, rupiah } from "../data/Menu";

export default function KartuMenu({ item }: { item: Menu }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm hover:shadow-lg">
      <h3 className="text-lg font-bold text-gray-800">
        {item.nama}
      </h3>

      <p className="mt-2 text-gray-600">
        Kategori: {item.kategori}
      </p>

      <p className="mt-2 font-bold text-pink-500">
        {rupiah(item.harga)}
      </p>

      <p className={item.stok === 0 ? "mt-2 font-semibold text-red-500" : "mt-2 text-green-600"}>
        {item.stok === 0 ? "Habis" : `Stok: ${item.stok}`}
      </p>

      <Link
        href={`/menu/${item.id}`}
        className="mt-4 inline-block rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
      >
        Lihat Detail
      </Link>
    </div>
  );
}