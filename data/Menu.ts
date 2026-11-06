export type Menu ={
    id: number;
    nama: string;
    kategori: string;
    harga: number;
    stok: number;
};

export const Menu: Menu[] = [
    {id: 1, nama: "Nasi Goreng spesial", kategori: "Makanan", harga: 12000, stok: 15},
    {id: 2, nama: "Mie ayam", kategori: "Makanan", harga: 10000, stok: 8},
    {id: 3, nama: "Es teh manis", kategori: "Minuman",harga: 3000, stok: 40},
    {id: 4, nama: "Jus alpukat", kategori: "Minuman",harga: 8000, stok: 0},
    {id: 5, nama: "Pisang goreng", kategori: "Camilan",harga: 5000, stok: 20},
    {id: 6, nama: "Risol mayo", kategori: "Camilan",harga: 4000, stok: 3,}
];

export function rupiah(n: number) {
    return "Rp" + n.toLocaleString("id-ID");
}