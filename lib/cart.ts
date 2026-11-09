
export type MenuCart = {
  id: string | number;
  nama: string;
  harga: number;
  stok: number;
  gambar?: string;
};

export type CartItem = MenuCart & {
  jumlah: number;
};

const CART_KEY = "keranjang";

export function getKeranjang(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function simpanKeranjang(items: CartItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(items));

    window.dispatchEvent(new Event("keranjang-berubah"));
  }
}

export function tambahItem(
  menu: MenuCart,
  jumlah: number
): { sukses: boolean; pesan: string } {
  const keranjang = getKeranjang();

  if (!Number.isInteger(jumlah) || jumlah < 1) {
    return { sukses: false, pesan: "Jumlah minimal 1." };
  }

  const index = keranjang.findIndex(
    (item) => String(item.id) === String(menu.id)
  );

  const jumlahLama = index >= 0 ? keranjang[index].jumlah : 0;
  const jumlahBaru = jumlahLama + jumlah;

  if (menu.stok <= 0) {
    return { sukses: false, pesan: "Menu ini habis." };
  }

  if (jumlahBaru > menu.stok) {
    return {
      sukses: false,
      pesan: `Stok hanya tersedia ${menu.stok}. Jumlah di keranjang sudah ${jumlahLama}.`,
    };
  }

  if (index >= 0) {
    keranjang[index] = { ...menu, jumlah: jumlahBaru };
  } else {
    keranjang.push({ ...menu, jumlah });
  }

  simpanKeranjang(keranjang);

  return {
    sukses: true,
    pesan: "Ditambahkan ke keranjang.",
  };
}

export function ubahJumlah(
  id: string | number,
  jumlah: number
) {
  const keranjang = getKeranjang();

  const hasil = keranjang.map((item) => {
    if (String(item.id) !== String(id)) {
      return item;
    }

    const jumlahAman = Number.isFinite(jumlah)
      ? Math.trunc(jumlah)
      : 1;

    return {
      ...item,
      jumlah: Math.min(
        item.stok,
        Math.max(1, jumlahAman)
      ),
    };
  });

  simpanKeranjang(hasil);
  return hasil;
}

export function hapusItem(id: string | number) {
  const hasil = getKeranjang().filter(
    (item) => String(item.id) !== String(id)
  );

  simpanKeranjang(hasil);
  return hasil;
}