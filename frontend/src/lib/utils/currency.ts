/**
 * Format angka menjadi Rupiah.
 *
 * 15000 -> "Rp 15.000"
 */
export function formatRupiah(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "Rp 0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Format angka menjadi format input Rupiah tanpa prefix "Rp".
 *
 * 15000 -> "15.000"
 */
export function formatRupiahInput(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "";
  }

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Mengubah input Rupiah menjadi integer.
 *
 * "15.000" -> 15000
 * "Rp 15.000" -> 15000
 * "15000" -> 15000
 */
export function parseRupiah(value: string): number {
  const cleaned = value.replace(/\D/g, "");

  return cleaned ? Number(cleaned) : 0;
}
