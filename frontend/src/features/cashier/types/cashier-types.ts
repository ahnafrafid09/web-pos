import { ReceiptData } from "@/lib/utils/printReceipt";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentSplit {
  paymentMethodId: string;
  amount: number;
}

export interface CashierTransaction {
  items: CartItem[];
  discount?: number;
  payments: PaymentSplit[];
}

export interface CheckoutItemDto {
  productId: string;
  quantity: number;
}

export interface CheckoutPaymentDto {
  paymentMethodId: string;
  amount: number;
}

export interface CashierCheckoutPayload {
  items: CheckoutItemDto[];
  discount?: number;
  payments: CheckoutPaymentDto[];
}

export interface CashierResponse {
  message: string;
  transactionId: string;
  receiptUrl: string;
  data: ReceiptData;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  type: "MENU" | "MERCHANDISE";
  sku: string | null;
  unit: string;
  sellingPrice: number;
  status: boolean;
  imageUrl: string | null;
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodItem {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  usageType: "PURCHASE" | "TRANSACTION" | "BOTH";
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
