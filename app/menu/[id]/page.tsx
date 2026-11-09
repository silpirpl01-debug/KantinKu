
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Menu, rupiah } from "../../../data/Menu";
import TambahKeKeranjang from "../../../components/tambahkekeranjang";
import TambahFavorit from "../../../components/tambahfavorit";

type Props = {
  params: Promise<{ id: string }>;
};

export default function DetailMenu({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-gray-500">Memuat detail menu...</p>
        </main>
      }
    >
      <IsiDetailMenu params={params} />
    </Suspense>
  );
}

async function IsiDetailMenu({ params }: Props) {
  const { id } = await params;

  const item = Menu.find((menu) => menu.id === Number(id));

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-xl border bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-800">
          {item.nama}
        </h1>

        <p className="mt-4 text-gray-600">
          Kategori: {item.kategori}
        </p>

        <p className="mt-3 text-xl font-bold text-pink-500">
          {rupiah(item.harga)}
        </p>

        <p
          className={
            item.stok === 0
              ? "mt-3 font-semibold text-red-500"
              : "mt-3 text-green-600"
          }
        >
          {item.stok === 0
            ? "Habis"
            : `Stok tersedia: ${item.stok}`}
        </p>

        <TambahFavorit id={item.id} />

        <TambahKeKeranjang
          id={item.id}
          nama={item.nama}
          harga={item.harga}
          stok={item.stok}
        />

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-pink-500 px-5 py-3 text-white hover:bg-pink-600"
        >
          Kembali ke Menu
        </Link>
      </div>
    </main>
  );
}
