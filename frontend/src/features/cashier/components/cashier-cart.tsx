"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils/currency";
import {
  useCashierStore,
  useCashierSubtotal,
  useCashierItemCount,
} from "../store/cashier.store";
import {
  MinusIcon,
  PlusIcon,
  Trash2Icon,
  ShoppingCartIcon,
} from "lucide-react";

export function CashierCart() {
  const cart = useCashierStore((state) => state.cart);
  const updateQuantity = useCashierStore((state) => state.updateQuantity);
  const removeFromCart = useCashierStore((state) => state.removeFromCart);
  const openPaymentModal = useCashierStore((state) => state.openPaymentModal);
  const subtotal = useCashierSubtotal();
  const itemCount = useCashierItemCount();

  return (
    <Card className="flex flex-col h-full border-l lg:border-l">
      <CardHeader className="border-b p-3 sm:p-4">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-5 w-5" />
            <span className="sm:hidden text-base">Keranjang</span>
            <span className="hidden sm:inline">Keranjang</span>
            {itemCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {itemCount}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <ShoppingCartIcon className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm">Keranjang kosong</p>
            <p className="text-xs mt-1">Pilih produk untuk memulai</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-2 sm:gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {formatRupiah(item.product.sellingPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <Button
                      size="icon-xs"
                      variant="outline"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="h-6 w-6 sm:h-8 sm:w-8"
                    >
                      <MinusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Button>
                    <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon-xs"
                      variant="outline"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="h-6 w-6 sm:h-8 sm:w-8"
                    >
                      <PlusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 sm:gap-1 shrink-0">
                    <span className="text-[10px] sm:text-sm font-semibold">
                      {formatRupiah(item.product.sellingPrice * item.quantity)}
                    </span>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => removeFromCart(item.product.id)}
                      className="h-4 w-4 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 sm:p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Subtotal
                </span>
                <span className="text-base sm:text-lg font-bold">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={cart.length === 0}
                onClick={openPaymentModal}
              >
                Bayar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
