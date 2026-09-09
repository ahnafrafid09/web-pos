"use client";

import { useState, useEffect } from "react";
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
  const [cashGiven, setCashGiven] = useState<string>("");

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

  function handleSelectPaymentMethod(methodId: string) {
    setSelectedMethod(methodId);
    const remaining =
      subtotal - paymentSplits.reduce((sum, split) => sum + split.amount, 0);
    if (remaining <= 0) {
      setPaymentSplits([]);
    }
  }

  function handleAddSplit() {
    if (!selectedMethod || !splitAmount) return;
    const amount = parseInt(splitAmount.replace(/\D/g, ""));
    if (!amount || amount <= 0) return;

    const currentTotal = paymentSplits.reduce(
      (sum, split) => sum + split.amount,
      0,
    );
    if (currentTotal + amount > subtotal) {
      toast.error("Jumlah split melebihi subtotal");
      return;
    }

    setPaymentSplits([
      ...paymentSplits,
      { paymentMethodId: selectedMethod, amount },
    ]);
    setSelectedMethod(null);
    setSplitAmount("");
  }

  function handleRemoveSplit(index: number) {
    setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
  }

  function handlePayFull() {
    if (paymentMethods.length > 0) {
      setPaymentSplits([
        { paymentMethodId: paymentMethods[0].id, amount: subtotal },
      ]);
      setCashGiven(String(subtotal));
    }
  }

  const totalFromSplits = paymentSplits.reduce(
    (sum, split) => sum + split.amount,
    0,
  );

  // Calculate cash amount
  const cashAmount = parseInt(cashGiven.replace(/\D/g, "") || "0");

  // Total paid: cash + all splits combined
  const totalPaid = cashAmount + totalFromSplits;

  // Calculate change (only when cash alone covers the subtotal)
  const change = cashAmount >= subtotal ? cashAmount - subtotal : 0;

  // Check if cash is given
  const hasCash = cashAmount > 0;

  // Remaining amount to pay
  const remaining = Math.max(0, subtotal - totalPaid);

  const isPaymentComplete =
    remaining === 0 && (hasCash || paymentSplits.length > 0);

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
      const payments: { paymentMethodId: string; amount: number }[] = [];

      // Add cash payment if given
      if (hasCash && cashAmount > 0) {
        const cashMethod =
          paymentMethods.find((m) => m.code === "CASH") ?? paymentMethods[0];
        if (cashMethod) {
          payments.push({
            paymentMethodId: cashMethod.id,
            amount: cashAmount,
          });
        }
      }

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
        payments: payments,
      };

      const response = await cashierService.checkout(payload);

      const receipt = response.data;
      console.log(response);

      try {
        await printReceipt(receipt);
      } catch (error) {
        console.error("Gagal print struk:", error);
      }

      toast.success(
        change > 0
          ? `Pembayaran berhasil! Jangan lupa berikan kembalian ${formatRupiah(change)}.`
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
    <>
      <Dialog open={isPaymentModalOpen} onOpenChange={closePaymentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5" />
              Pembayaran
            </DialogTitle>
            <DialogDescription>
              Masukkan jumlah uang atau pilih metode pembayaran.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Total Display */}
            <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
              <span className="text-sm font-medium">Total Pembayaran</span>
              <span className="text-xl font-bold">
                {formatRupiah(subtotal)}
              </span>
            </div>

            {/* Cash Input Section */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Bayar Tunai</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan jumlah uang"
                  value={cashGiven}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setCashGiven(value);
                  }}
                  className="flex-1 h-10 px-3 text-sm rounded-lg border bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                {cashGiven && (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setCashGiven("")}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Change Display */}
              {hasCash && (
                <div
                  className={`p-3 rounded-lg flex justify-between items-center ${cashAmount >= subtotal ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
                >
                  <span className="text-sm font-medium">
                    {cashAmount >= subtotal ? "Kembalian" : "Kurang"}
                  </span>
                  <span
                    className={`text-lg font-bold ${cashAmount >= subtotal ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                  >
                    {formatRupiah(Math.abs(cashAmount - subtotal))}
                  </span>
                </div>
              )}

              {/* Quick Cash Buttons */}
              {subtotal > 0 && (
                <div className="flex flex-wrap gap-1">
                  {[10000, 20000, 50000, 100000, 150000, 200000, 500000].map(
                    (amount) => (
                      <Button
                        key={amount}
                        size="xs"
                        variant={amount === subtotal ? "default" : "outline"}
                        onClick={() => setCashGiven(String(amount))}
                        disabled={amount < subtotal}
                      >
                        {formatRupiah(amount).replace("Rp ", "")}
                      </Button>
                    ),
                  )}
                  {/* Exact amount button */}
                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => setCashGiven(String(subtotal))}
                  >
                    Tepat: {formatRupiah(subtotal).replace("Rp ", "")}
                  </Button>
                </div>
              )}
            </div>

            {/* Split Payment Section - Only shown if cash is not enough */}
            {(!hasCash || cashAmount < subtotal) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <SplitIcon className="h-4 w-4" />
                    Pembayaran Tambahan
                  </label>
                  {paymentSplits.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <RotateCcwIcon className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                </div>

                {hasCash && cashAmount < subtotal && (
                  <div className="bg-primary/10 p-2 rounded-lg flex justify-between items-center mb-2">
                    <span className="text-xs font-medium">Belum Terbayar</span>
                    <span className="text-sm font-semibold text-primary">
                      {formatRupiah(remaining)}
                    </span>
                  </div>
                )}

                {!hasCash && remaining > 0 && (
                  <div className="bg-primary/10 p-2 rounded-lg flex justify-between items-center mb-2">
                    <span className="text-xs font-medium">
                      Total Yang Harus Dibayar
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {formatRupiah(remaining)}
                    </span>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleSelectPaymentMethod(method.id)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xs font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>

                {/* Split Input */}
                {selectedMethod && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Masukkan jumlah"
                        value={splitAmount}
                        onChange={(e) => setSplitAmount(e.target.value)}
                        className="w-full h-8 px-2.5 text-sm rounded-lg border bg-transparent"
                      />
                    </div>
                    <Button size="sm" onClick={handleAddSplit}>
                      <PlusIcon className="h-4 w-4 mr-1" /> Tambah
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedMethod(null);
                        setSplitAmount("");
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Split List */}
                {paymentSplits.length > 0 && (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {paymentSplits.map((split, index) => {
                      const method = paymentMethods.find(
                        (pm) => pm.id === split.paymentMethodId,
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">
                              {method?.name || "Unknown"}
                            </Badge>
                            <span className="text-xs font-medium">
                              {formatRupiah(split.amount)}
                            </span>
                          </div>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => handleRemoveSplit(index)}
                            className="h-4 w-4 text-muted-foreground hover:text-destructive"
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={submitting}
                onClick={openSplitBillModal}
              >
                <SplitIcon className="h-4 w-4 mr-1" /> Split Bill
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                disabled={submitting || paymentMethods.length === 0}
                onClick={handlePayFull}
              >
                Bayar Full
              </Button>
              <Button
                className="flex-[2]"
                disabled={!isPaymentComplete || submitting}
                onClick={handleCompletePayment}
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                {submitting ? "Memproses..." : "Selesai Pembayaran"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
