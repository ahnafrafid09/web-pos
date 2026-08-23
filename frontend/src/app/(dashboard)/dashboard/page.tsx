import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const date = new Date();

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">
            Ringkasan operasional usaha
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="text-sm text-muted-foreground">{formattedDate}</div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Penjualan Hari Ini"
          value="Rp 0"
          description="Belum ada transaksi"
          icon={<Wallet className="h-5 w-5" />}
        />

        <StatCard
          title="Jumlah Transaksi"
          value="0"
          description="Transaksi hari ini"
          icon={<ShoppingCart className="h-5 w-5" />}
        />

        <StatCard
          title="Estimasi Keuntungan"
          value="Rp 0"
          description="Berdasarkan HPP"
          icon={<TrendingUp className="h-5 w-5" />}
        />

        <StatCard
          title="Produk Aktif"
          value="0"
          description="Produk yang tersedia"
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* SALES */}
        <section className="border bg-background xl:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">Penjualan</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Ringkasan penjualan 7 hari terakhir
              </p>
            </div>

            <select className="h-9 border bg-background px-3 text-sm outline-none">
              <option>7 Hari</option>
              <option>30 Hari</option>
            </select>
          </div>

          <div className="flex h-72 items-center justify-center p-5">
            <div className="text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/50" />

              <p className="mt-3 font-medium">Belum ada data penjualan</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Grafik penjualan akan muncul di sini.
              </p>
            </div>
          </div>
        </section>

        {/* QUICK ACTION */}
        <section className="border bg-background">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">Aksi Cepat</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Akses fitur yang sering digunakan
            </p>
          </div>

          <div className="divide-y">
            <QuickAction
              title="Transaksi Baru"
              description="Mulai transaksi kasir"
              icon={<ShoppingCart className="h-5 w-5" />}
              href="/dashboard/transactions"
            />

            <QuickAction
              title="Tambah Produk"
              description="Tambahkan produk baru"
              icon={<Package className="h-5 w-5" />}
              href="/dashboard/products"
            />

            <QuickAction
              title="Kelola Stok"
              description="Lihat dan update stok"
              icon={<TrendingUp className="h-5 w-5" />}
              href="/dashboard/stock"
            />
          </div>
        </section>
      </div>

      {/* BOTTOM */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border bg-background">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">Transaksi Terbaru</h2>
          </div>

          <div className="p-10 text-center">
            <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/50" />

            <p className="mt-3 text-sm text-muted-foreground">
              Belum ada transaksi.
            </p>
          </div>
        </section>

        <section className="border bg-background">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">Peringatan Stok</h2>
          </div>

          <div className="p-10 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />

            <p className="mt-3 text-sm text-muted-foreground">
              Tidak ada peringatan stok saat ini.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border bg-background">
      <div className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>

          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="text-primary">{icon}</div>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
    >
      <div className="text-primary">{icon}</div>

      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}
