// src/lib/printReceipt.ts

export interface ReceiptData {
  id: string;
  invoiceNumber: string;
  createdAt: string;

  cashier: {
    name: string;
  };

  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];

  subtotal: number;
  discount: number;
  serviceCharge: number;
  tax: number;
  total: number;
  totalPaid: number;
  change: number;

  payments: {
    paymentMethodId: string;
    paymentMethodName: string;
    amount: number;
  }[];
}

interface AndroidPrinter {
  printReceipt: (receipt: string) => void;
}

declare global {
  interface Window {
    AndroidPrinter?: AndroidPrinter;
  }
}

const RECEIPT_WIDTH = 32;

const formatRupiah = (value: number) => {
  return `Rp${Math.round(value).toLocaleString("id-ID")}`;
};

const centerText = (text: string) => {
  if (text.length >= RECEIPT_WIDTH) {
    return text.slice(0, RECEIPT_WIDTH);
  }

  const leftPadding = Math.floor((RECEIPT_WIDTH - text.length) / 2);

  return " ".repeat(leftPadding) + text;
};

const summaryRow = (label: string, value: number) => {
  const valueText = formatRupiah(value);

  const spaces = Math.max(1, RECEIPT_WIDTH - label.length - valueText.length);

  return label + " ".repeat(spaces) + valueText;
};

const formatItem = (
  name: string,
  quantity: number,
  price: number,
  subtotal: number,
) => {
  const detail = `${quantity} x ${formatRupiah(price)}`;
  const subtotalText = formatRupiah(subtotal);

  const spaces = Math.max(
    1,
    RECEIPT_WIDTH - detail.length - subtotalText.length,
  );

  return [
    name.slice(0, RECEIPT_WIDTH),
    `${detail}${" ".repeat(spaces)}${subtotalText}`,
  ].join("\n");
};

const buildReceiptText = (receipt: ReceiptData) => {
  const date = new Date(receipt.createdAt);

  const formattedDate = date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const line = "=".repeat(RECEIPT_WIDTH);
  const separator = "-".repeat(RECEIPT_WIDTH);

  const rows: string[] = [];

  // HEADER
  rows.push(line);
  rows.push(centerText("WARTEG POS"));
  rows.push(centerText("Terima Kasih"));
  rows.push(line);

  // TRANSACTION INFO
  rows.push(`No     : ${receipt.invoiceNumber}`);
  rows.push(`Tanggal: ${formattedDate}`);
  rows.push(`Kasir  : ${receipt.cashier.name}`);

  rows.push("");
  rows.push(separator);

  // ITEMS
  for (const item of receipt.items) {
    rows.push(formatItem(item.name, item.quantity, item.price, item.subtotal));

    rows.push("");
  }

  rows.push(separator);

  // SUMMARY
  rows.push(summaryRow("Subtotal", receipt.subtotal));

  if (receipt.discount > 0) {
    rows.push(summaryRow("Diskon", receipt.discount));
  }

  if (receipt.serviceCharge > 0) {
    rows.push(summaryRow("Service", receipt.serviceCharge));
  }

  if (receipt.tax > 0) {
    rows.push(summaryRow("Pajak", receipt.tax));
  }

  rows.push(separator);

  rows.push(summaryRow("TOTAL", receipt.total));

  rows.push("");

  // PAYMENT
  for (const payment of receipt.payments) {
    rows.push(summaryRow(payment.paymentMethodName, payment.amount));
  }

  rows.push(summaryRow("Kembali", receipt.change));

  rows.push("");

  // FOOTER
  rows.push(line);
  rows.push(centerText("TERIMA KASIH"));
  rows.push(centerText("Selamat menikmati"));
  rows.push(line);

  return rows.join("\n");
};

const printFromAndroid = (receiptText: string) => {
  if (!window.AndroidPrinter) {
    throw new Error("Android Printer Bridge tidak tersedia");
  }

  window.AndroidPrinter.printReceipt(receiptText);
};

const printFromBrowser = (receiptText: string, invoiceNumber: string) => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("Popup printer diblokir oleh browser");
  }

  const escapedReceipt = receiptText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${invoiceNumber}</title>

        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 58mm;
          }

          body {
            padding: 3mm;
            font-family: "Courier New", monospace;
            font-size: 11px;
            line-height: 1.35;
            white-space: pre-wrap;
            word-break: break-word;
          }
        </style>
      </head>

      <body>${escapedReceipt}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
};

export const printReceipt = async (receipt: ReceiptData) => {
  if (typeof window === "undefined") {
    throw new Error("Printer hanya dapat digunakan di browser");
  }

  const receiptText = buildReceiptText(receipt);

  // =========================
  // ANDROID
  // =========================

  if (window.AndroidPrinter) {
    printFromAndroid(receiptText);
    return;
  }

  // =========================
  // LAPTOP / BROWSER
  // =========================

  printFromBrowser(receiptText, receipt.invoiceNumber);
};
