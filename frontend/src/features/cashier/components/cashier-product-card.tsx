"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils/currency";
import type { Product } from "../types/cashier-types";
import { useCashierStore } from "../store/cashier.store";
import { PlusIcon } from "lucide-react";

interface CashierProductCardProps {
  product: Product;
}

export function CashierProductCard({ product }: CashierProductCardProps) {
  const addToCart = useCashierStore((state) => state.addToCart);

  return (
    <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group">
      <CardContent className="px-3 flex flex-col gap-2">
        <div className="aspect-square w-full rounded bg-muted flex items-center justify-center overflow-hidden relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              <span className="text-xs mt-1">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="bg-white text-black hover:bg-white/90"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          {product.category && (
            <span className="text-xs text-muted-foreground truncate">
              {product.category.name}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold tracking-tight text-primary">
              {formatRupiah(product.sellingPrice)}
            </span>

            <span className="text-[11px] font-medium text-muted-foreground">
              / {product.unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
