import { Menu } from "../../data/Menu";
import KontrolMenu from "../../components/kontrolMenu";


export default function HalamanMenu() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        Katalog Menu Kantin
      </h1>

      <p className="mb-8 text-gray-600">
        Pilih makanan dan minuman favoritmu.
      </p>

      <KontrolMenu data={Menu} />
    </main>
  );
}