
"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("favorit-berubah", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("favorit-berubah", callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot() {
  return false;
}

export default function TambahFavorit({
  id,
}: {
  id: string | number;
}) {
  const getSnapshot = useCallback(() => {
    try {
      const data = localStorage.getItem("favorit");
      const simpan = data ? JSON.parse(data) : [];

      return (
        Array.isArray(simpan) &&
        simpan.some((item) => Number(item) === Number(id))
      );
    } catch {
      return false;
    }
  }, [id]);

  const favorit = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function toggleFavorit() {
    try {
      const data = localStorage.getItem("favorit");
      const isi = data ? JSON.parse(data) : [];

      const simpan: number[] = Array.isArray(isi)
        ? isi.map(Number)
        : [];

      const sudahFavorit = simpan.includes(Number(id));

      const hasil = sudahFavorit
        ? simpan.filter((x) => x !== Number(id))
        : [...simpan, Number(id)];

      localStorage.setItem("favorit", JSON.stringify(hasil));

      window.dispatchEvent(new Event("favorit-berubah"));
    } catch {
      console.error("Gagal menyimpan menu favorit.");
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFavorit}
      aria-pressed={favorit}
      className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
    >
      {favorit ? "♥ Favorit" : "♡ Tambah favorit"}
    </button>
  );
}