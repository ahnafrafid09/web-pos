"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils/currency";
import { useCashierStore, useCashierSubtotal } from "../store/cashier.store";
import { cashierService } from "../services/cashier.service";
import { paymentMethodService } from "@/features/payment-method/services/payment-method.service";
import type { PaymentMethodItem } from "../types/cashier-types";
import {
  CreditCardIcon,
  SplitIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  BanknoteIcon,
  RotateCcwIcon,
} from "lucide-react";
import { toast } from "sonner";
import { printReceipt } from "@/lib/utils/printReceipt";

export function CashierPaymentModal() {
  const isPaymentModalOpen = useCashierStore(
    (state) => state.isPaymentModalOpen,
  );

  const closePaymentModal = useCashierStore((state) => state.closePaymentModal);

  const openSplitBillModal = useCashierStore(
    (state) => state.openSplitBillModal,
  );

  const paymentSplits = useCashierStore((state) => state.paymentSplits);

  const setPaymentSplits = useCashierStore((state) => state.setPaymentSplits);

  const cart = useCashierStore((state) => state.cart);

  const resetTransaction = useCashierStore((state) => state.resetTransaction);

  const subtotal = useCashierSubtotal();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const [splitAmount, setSplitAmount] = useState("");
  const [cashGiven, setCashGiven] = useState("");

  useEffect(() => {
    if (isPaymentModalOpen) {
      fetchPaymentMethods();
    }
  }, [isPaymentModalOpen]);

  async function fetchPaymentMethods() {
    setLoading(true);

    try {
      const response = await paymentMethodService.findAll({
        status: true,
        limit: 100,
      });

      setPaymentMethods(
        response.data.filter(
          (pm) =>
            pm.status &&
            (pm.usageType === "TRANSACTION" || pm.usageType === "BOTH"),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      toast.error("Gagal memuat metode pembayaran");
    } finally {
      setLoading(false);
    }
  }

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedMethod,
  );

  const isCashPayment = selectedPaymentMethod?.code === "CASH";

  const totalFromSplits = paymentSplits.reduce(
    (sum, split) => sum + split.amount,
    0,
  );

  const cashAmount = parseInt(cashGiven.replace(/\D/g, "") || "0");

  const totalPaid = cashAmount + totalFromSplits;

  const remaining = Math.max(0, subtotal - totalPaid);

  const change = cashAmount >= subtotal ? cashAmount - subtotal : 0;

  const hasCash = cashAmount > 0;

  const isPaymentComplete =
    remaining === 0 && (hasCash || paymentSplits.length > 0);

  function handleSelectPaymentMethod(methodId: string) {
    setSelectedMethod(methodId);
    setCashGiven("");
    setSplitAmount("");
  }

  function handleSetCashAmount(amount: number) {
    setCashGiven(String(amount));
  }

  function handleAddSplit() {
    if (!selectedMethod || !splitAmount) {
      return;
    }

    const amount = parseInt(splitAmount.replace(/\D/g, ""));

    if (!amount || amount <= 0) {
      toast.error("Nominal pembayaran tidak valid");
      return;
    }

    const currentTotal = paymentSplits.reduce(
      (sum, split) => sum + split.amount,
      0,
    );

    if (currentTotal + amount > subtotal) {
      toast.error("Jumlah pembayaran melebihi subtotal");
      return;
    }

    setPaymentSplits([
      ...paymentSplits,
      {
        paymentMethodId: selectedMethod,
        amount,
      },
    ]);

    setSelectedMethod(null);
    setSplitAmount("");
  }

  function handleRemoveSplit(index: number) {
    setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
  }

  function handlePayFull() {
    const cashMethod =
      paymentMethods.find((method) => method.code === "CASH") ??
      paymentMethods[0];

    if (!cashMethod) {
      toast.error("Metode pembayaran tidak tersedia");
      return;
    }

    setPaymentSplits([
      {
        paymentMethodId: cashMethod.id,
        amount: subtotal,
      },
    ]);

    setSelectedMethod(cashMethod.id);
    setCashGiven(String(subtotal));
  }

  async function handleCompletePayment() {
    if (cart.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    if (!isPaymentComplete) {
      toast.error(
        `Pembayaran belum lengkap. Masih kurang ${formatRupiah(remaining)}`,
      );
      return;
    }

    setSubmitting(true);

    try {
      const payments: {
        paymentMethodId: string;
        amount: number;
      }[] = [];

      /**
       * CASH
       */
      if (hasCash && cashAmount > 0) {
        const cashMethod =
          paymentMethods.find((method) => method.code === "CASH") ??
          paymentMethods[0];

        if (cashMethod) {
          payments.push({
            paymentMethodId: cashMethod.id,
            amount: cashAmount,
          });
        }
      }

      /**
       * OTHER PAYMENT METHODS
       */
      if (paymentSplits.length > 0) {
        paymentSplits.forEach((split) => {
          payments.push({
            paymentMethodId: split.paymentMethodId,
            amount: split.amount,
          });
        });
      }

      if (payments.length === 0) {
        toast.error("Pilih metode pembayaran terlebih dahulu");
        return;
      }

      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        payments,
      };

      const response = await cashierService.checkout(payload);

      const receipt = response.data;

      try {
        await printReceipt(receipt);
      } catch (error) {
        console.error("Gagal print struk:", error);
      }

      toast.success(
        change > 0
          ? `Pembayaran berhasil! Kembalian ${formatRupiah(change)}.`
          : "Pembayaran berhasil!",
        {
          duration: 5000,
        },
      );

      resetTransaction();
      closePaymentModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Pembayaran gagal");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setPaymentSplits([]);
    setCashGiven("");
    setSelectedMethod(null);
    setSplitAmount("");
  }

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={closePaymentModal}>
      <DialogContent
        className="
          w-[calc(100%-1rem)]
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          p-4
          sm:p-6
        "
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CreditCardIcon className="h-5 w-5" />
            Pembayaran
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm">
            Pilih metode pembayaran terlebih dahulu, kemudian masukkan nominal
            pembayaran.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ========================= */}
          {/* TOTAL */}
          {/* ========================= */}

          <div
            className="
              rounded-xl
              border
              bg-muted/40
              p-4
              sm:p-5
            "
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Total Pembayaran
              </span>

              <span className="text-xl sm:text-2xl font-bold">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </div>

          {/* ========================= */}
          {/* PAYMENT METHOD */}
          {/* ========================= */}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Metode Pembayaran</h3>

                <p className="text-xs text-muted-foreground">
                  Pilih metode pembayaran
                </p>
              </div>

              {paymentSplits.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs"
                >
                  <RotateCcwIcon className="mr-1 h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl border bg-muted/40"
                  />
                ))}
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Belum ada metode pembayaran
                </p>
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  sm:grid-cols-3
                "
              >
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleSelectPaymentMethod(method.id)}
                      className={`
                        relative
                        min-h-16
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition
                        hover:border-primary/50
                        hover:bg-muted/50
                        ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "bg-background"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute right-2 top-2">
                          <CheckIcon className="h-4 w-4 text-primary" />
                        </div>
                      )}

                      <div className="flex flex-col gap-1 pr-5">
                        <span className="text-sm font-semibold">
                          {method.name}
                        </span>

                        {method.code && (
                          <span className="text-[10px] uppercase text-muted-foreground">
                            {method.code}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================= */}
          {/* SELECTED METHOD */}
          {/* ========================= */}

          {selectedMethod && selectedPaymentMethod && (
            <div className="space-y-4 rounded-xl border p-4">
              <div className="flex items-center gap-2">
                {isCashPayment ? (
                  <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                )}

                <div>
                  <p className="text-sm font-semibold">
                    {selectedPaymentMethod.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Masukkan nominal pembayaran
                  </p>
                </div>
              </div>

              {/* ========================= */}
              {/* NOMINAL */}
              {/* ========================= */}

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Nominal
                </label>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    placeholder="0"
                    value={isCashPayment ? cashGiven : splitAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      if (isCashPayment) {
                        setCashGiven(value);
                      } else {
                        setSplitAmount(value);
                      }
                    }}
                    className="
                      h-14
                      w-full
                      rounded-xl
                      border
                      bg-background
                      px-4
                      text-right
                      text-xl
                      font-semibold
                      outline-none
                      transition
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                    "
                  />

                  {(isCashPayment ? cashGiven : splitAmount) && (
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        if (isCashPayment) {
                          setCashGiven("");
                        } else {
                          setSplitAmount("");
                        }
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* ========================= */}
              {/* QUICK CASH */}
              {/* ========================= */}

              {isCashPayment && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Nominal cepat
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {[10000, 20000, 50000, 100000].map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetCashAmount(amount)}
                      >
                        {formatRupiah(amount).replace("Rp ", "")}
                      </Button>
                    ))}

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetCashAmount(subtotal)}
                    >
                      Uang Pas
                    </Button>

                    {subtotal < 100000 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetCashAmount(100000)}
                      >
                        100.000
                      </Button>
                    )}

                    {subtotal < 200000 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetCashAmount(200000)}
                      >
                        200.000
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* ========================= */}
              {/* PAYMENT STATUS */}
              {/* ========================= */}

              {(isCashPayment
                ? cashAmount > 0
                : parseInt(splitAmount.replace(/\D/g, "") || "0") > 0) && (
                <div
                  className={`
                    rounded-xl
                    p-3
                    ${
                      isCashPayment
                        ? cashAmount >= subtotal
                          ? "bg-green-50 dark:bg-green-950/30"
                          : "bg-red-50 dark:bg-red-950/30"
                        : "bg-muted/50"
                    }
                  `}
                >
                  {isCashPayment ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dibayar</span>

                        <span className="font-medium">
                          {formatRupiah(cashAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>

                        <span className="font-medium">
                          {formatRupiah(subtotal)}
                        </span>
                      </div>

                      <div className="border-t pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            {cashAmount >= subtotal ? "Kembalian" : "Kurang"}
                          </span>

                          <span
                            className={`
                              text-lg
                              font-bold
                              ${
                                cashAmount >= subtotal
                                  ? "text-green-700 dark:text-green-400"
                                  : "text-red-700 dark:text-red-400"
                              }
                            `}
                          >
                            {formatRupiah(
                              cashAmount >= subtotal ? change : remaining,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Nominal Pembayaran
                      </span>

                      <span className="text-lg font-bold">
                        {formatRupiah(
                          parseInt(splitAmount.replace(/\D/g, "") || "0"),
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ========================= */}
              {/* ADD PAYMENT */}
              {/* ========================= */}

              {!isCashPayment && (
                <Button
                  type="button"
                  className="w-full"
                  disabled={
                    !splitAmount ||
                    parseInt(splitAmount.replace(/\D/g, "") || "0") <= 0
                  }
                  onClick={handleAddSplit}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Tambahkan Pembayaran
                </Button>
              )}

              {isCashPayment && (
                <Button
                  type="button"
                  className="w-full"
                  disabled={!cashGiven || cashAmount <= 0}
                  onClick={() => {
                    if (cashAmount < subtotal) {
                      toast.error(
                        `Uang masih kurang ${formatRupiah(
                          subtotal - cashAmount,
                        )}`,
                      );
                      return;
                    }

                    toast.success("Pembayaran tunai siap");
                  }}
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Gunakan Pembayaran
                </Button>
              )}
            </div>
          )}

          {/* ========================= */}
          {/* PAYMENT SPLITS */}
          {/* ========================= */}

          {paymentSplits.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SplitIcon className="h-4 w-4" />

                  <span className="text-sm font-semibold">Pembayaran</span>
                </div>

                <span className="text-xs text-muted-foreground">
                  {formatRupiah(totalFromSplits)}
                </span>
              </div>

              <div className="space-y-2">
                {paymentSplits.map((split, index) => {
                  const method = paymentMethods.find(
                    (pm) => pm.id === split.paymentMethodId,
                  );

                  return (
                    <div
                      key={index}
                      className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-lg
                          bg-muted/50
                          p-3
                        "
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px]"
                        >
                          {method?.name || "Unknown"}
                        </Badge>

                        <span className="truncate text-sm font-medium">
                          {formatRupiah(split.amount)}
                        </span>
                      </div>

                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleRemoveSplit(index)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* REMAINING */}
          {/* ========================= */}

          {remaining > 0 && totalPaid > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-primary/10 p-3">
              <span className="text-sm font-medium">Belum Terbayar</span>

              <span className="font-semibold text-primary">
                {formatRupiah(remaining)}
              </span>
            </div>
          )}

          {/* ========================= */}
          {/* FOOTER ACTION */}
          {/* ========================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-2
              border-t
              pt-4
              sm:grid-cols-3
            "
          >
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={openSplitBillModal}
              className="w-full"
            >
              <SplitIcon className="mr-2 h-4 w-4" />
              Split Bill
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={submitting || paymentMethods.length === 0}
              onClick={handlePayFull}
              className="w-full"
            >
              Bayar Full
            </Button>

            <Button
              type="button"
              disabled={!isPaymentComplete || submitting}
              onClick={handleCompletePayment}
              className="w-full sm:col-span-1"
            >
              <CheckIcon className="mr-2 h-4 w-4" />

              {submitting ? "Memproses..." : "Selesaikan Pembayaran"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
