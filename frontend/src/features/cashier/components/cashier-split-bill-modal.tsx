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
import { paymentMethodService } from "@/features/payment-method/services/payment-method.service";
import type { PaymentMethodItem } from "../types/cashier-types";
import { SplitIcon, CheckIcon, XIcon, PlusIcon } from "lucide-react";

export function CashierSplitBillModal() {
  const isSplitBillModalOpen = useCashierStore(
    (state) => state.isSplitBillModalOpen,
  );
  const closeSplitBillModal = useCashierStore(
    (state) => state.closeSplitBillModal,
  );
  const paymentSplits = useCashierStore((state) => state.paymentSplits);
  const setPaymentSplits = useCashierStore((state) => state.setPaymentSplits);
  const subtotal = useCashierSubtotal();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [splitAmount, setSplitAmount] = useState("");
  const [newSplitCount, setNewSplitCount] = useState(1);

  useEffect(() => {
    if (isSplitBillModalOpen && paymentMethods.length === 0) {
      fetchPaymentMethods();
    }
  }, [isSplitBillModalOpen]);

  async function fetchPaymentMethods() {
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
    }
  }

  function handleAddNewSplit() {
    if (!selectedMethod) return;

    for (let i = 0; i < newSplitCount; i++) {
      setPaymentSplits([
        ...paymentSplits,
        { paymentMethodId: selectedMethod, amount: 0 },
      ]);
    }

    setSelectedMethod(null);
    setSplitAmount("");
    setNewSplitCount(1);
  }

  function handleUpdateSplitAmount(index: number, amount: string) {
    const cleaned = amount.replace(/\D/g, "");
    const numAmount = parseFloat(cleaned) || 0;

    const newSplits = [...paymentSplits];
    newSplits[index] = { ...newSplits[index], amount: numAmount };
    setPaymentSplits(newSplits);
  }

  function handleRemoveSplit(index: number) {
    setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
  }

  function handleConfirmSplit() {
    const totalSplit = paymentSplits.reduce(
      (sum, split) => sum + split.amount,
      0,
    );
    if (Math.abs(totalSplit - subtotal) > 1) {
      alert(
        `Total pembayaran ${formatRupiah(totalSplit)} belum lengkap. Harus ${formatRupiah(subtotal)}.`,
      );
      return;
    }
    closeSplitBillModal();
  }

  const remaining =
    subtotal - paymentSplits.reduce((sum, split) => sum + split.amount, 0);

  return (
    <Dialog open={isSplitBillModalOpen} onOpenChange={closeSplitBillModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SplitIcon className="h-5 w-5" />
            Split Bill
          </DialogTitle>
          <DialogDescription>
            Tambahkan metode pembayaran untuk membagi tagihan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Total Display */}
          <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium">Total Tagihan</span>
            <span className="text-xl font-bold">{formatRupiah(subtotal)}</span>
          </div>

          {/* Remaining Display */}
          {remaining > 0 && (
            <div className="bg-primary/10 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm font-medium">Belum Terisi</span>
              <span className="text-lg font-semibold text-primary">
                {formatRupiah(remaining)}
              </span>
            </div>
          )}

          {/* Add New Split */}
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="text-sm font-medium">Tambah Split Baru</h4>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Metode Pembayaran
              </label>
              <select
                value={selectedMethod || ""}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full h-8 px-2.5 text-sm rounded-lg border bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Pilih Metode</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Jumlah Split
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newSplitCount}
                  onChange={(e) =>
                    setNewSplitCount(parseInt(e.target.value) || 1)
                  }
                  className="w-16 h-8 px-2.5 text-sm rounded-lg border bg-transparent text-center outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <span className="text-xs text-muted-foreground">
                  metode baru
                </span>
              </div>
            </div>

            <Button
              onClick={handleAddNewSplit}
              disabled={!selectedMethod}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Tambah Slot Pembayaran
            </Button>
          </div>

          {/* Split List Editor */}
          {paymentSplits.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Daftar Pembayaran ({paymentSplits.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {paymentSplits.map((split, index) => {
                  const method = paymentMethods.find(
                    (pm) => pm.id === split.paymentMethodId,
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-1">
                          {method?.name || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="0"
                          value={
                            split.amount > 0
                              ? formatRupiahInput(split.amount)
                              : ""
                          }
                          onChange={(e) =>
                            handleUpdateSplitAmount(index, e.target.value)
                          }
                          className="w-28 h-8 px-2.5 text-sm rounded-lg border bg-transparent text-right outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => handleRemoveSplit(index)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={closeSplitBillModal}
            >
              Kembali
            </Button>
            <Button
              className="flex-[2]"
              disabled={paymentSplits.length === 0 || remaining !== 0}
              onClick={handleConfirmSplit}
            >
              <CheckIcon className="h-4 w-4 mr-1" /> Konfirmasi Split
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatRupiahInput(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}
