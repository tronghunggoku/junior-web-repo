import { calculateTotals } from '../utils/arrayHelpers.js';

function createCartStore() {
  let items = [];
  const listeners = new Set();

  const notify = () => {
    const totals = calculateTotals(items);
    listeners.forEach((listener) => listener([...items], totals));
  };

  return {
    getItems() {
      return [...items];
    },

    addItem(product) {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({ ...product, quantity: 1 });
      }
      notify();
    },

    updateQuantity(productId, delta) {
      const item = items.find((i) => i.id === productId);
      if (!item) return;

      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        notify();
      }
    },

    removeItem(productId) {
      items = items.filter((item) => item.id !== productId);
      notify();
    },

    clear() {
      items = [];
      notify();
    },

    subscribe(listener) {
      listeners.add(listener);
      listener([...items], calculateTotals(items));
      return () => listeners.delete(listener);
    },
  };
}

export const cartStore = createCartStore();
