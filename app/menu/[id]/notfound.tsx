import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 py-10">
      <div className="w-full rounded-xl border bg-white p-10 text-center shadow-sm">
        <h1 className="text-6xl font-bold text-pink-500">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Menu Tidak Ditemukan
        </h2>

        <p className="mt-3 text-gray-600">
          Maaf, menu yang kamu cari tidak tersedia.
        </p>

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-pink-500 px-6 py-3 text-white hover:bg-pink-600"
        >
          Kembali ke Menu
        </Link>
      </div>
    </main>
  );
}