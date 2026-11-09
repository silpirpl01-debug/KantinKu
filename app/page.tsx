import Link from "next/link";

export default function Beranda() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-xl bg-pink-100 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat Datang di Kantinku
        </h1>

        <p className="mt-4 text-gray-600">
          Temukan makanan enak dan terdekat dari kamu!
        </p>

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-pink-600 px-6 py-3 text-white hover:bg-pink-700"
        >
          Lihat Menu
        </Link>
      </section>
    </main>
  );
}