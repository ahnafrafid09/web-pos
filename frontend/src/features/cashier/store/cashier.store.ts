import { create } from "zustand";
import type { CartItem, PaymentSplit } from "../types/cashier-types";

interface CashierState {
  cart: CartItem[];
  paymentSplits: PaymentSplit[];
  isPaymentModalOpen: boolean;
  isSplitBillModalOpen: boolean;
  isTransactionComplete: boolean;

  // Cart actions
  addToCart: (product: CartItem["product"]) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Payment split actions
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  openSplitBillModal: () => void;
  closeSplitBillModal: () => void;
  setPaymentSplits: (splits: PaymentSplit[]) => void;
  resetPaymentSplits: () => void;

  // Transaction state
  setTransactionComplete: (complete: boolean) => void;
  resetTransaction: () => void;
}

export const useCashierStore = create<CashierState>((set, get) => ({
  cart: [],
  paymentSplits: [],
  isPaymentModalOpen: false,
  isSplitBillModalOpen: false,
  isTransactionComplete: false,

  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      set({ cart: updatedCart });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const updatedCart = get()
      .cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      )
      .filter((item) => item.quantity > 0);

    set({ cart: updatedCart });
  },

  removeFromCart: (productId) => {
    const updatedCart = get().cart.filter(
      (item) => item.product.id !== productId,
    );
    set({ cart: updatedCart });
  },

  clearCart: () => {
    set({ cart: [], paymentSplits: [] });
  },

  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),
  openSplitBillModal: () => set({ isSplitBillModalOpen: true }),
  closeSplitBillModal: () => set({ isSplitBillModalOpen: false }),
  setPaymentSplits: (splits) => set({ paymentSplits: splits }),
  resetPaymentSplits: () => set({ paymentSplits: [] }),

  setTransactionComplete: (complete) =>
    set({ isTransactionComplete: complete }),
  resetTransaction: () =>
    set({
      cart: [],
      paymentSplits: [],
      isPaymentModalOpen: false,
      isSplitBillModalOpen: false,
      isTransactionComplete: false,
    }),
}));

// Selectors
export const useCashierSubtotal = () => {
  const subtotal = useCashierStore((state) =>
    state.cart.reduce(
      (sum, item) => sum + item.product.sellingPrice * item.quantity,
      0,
    ),
  );
  return subtotal;
};

export const useCashierItemCount = () => {
  const itemCount = useCashierStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0),
  );
  return itemCount;
};
