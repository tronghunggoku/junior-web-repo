import { useEffect } from 'react';
import { useShopStore } from './store/shop-store.js';
import { CartSummary } from './components/cart-summary.jsx';
import { PreferencesBar } from './components/preferences-bar.jsx';
import { ProductCatalog } from './components/product-catalog.jsx';

/** Bài 1: Zustand store (cart + preferences slice) có persist localStorage. */
export function ZustandShopDemo() {
  const theme = useShopStore((state) => state.theme);

  // Theme là client state đã persist => áp lên <html> để cả trang đổi màu
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <section aria-labelledby="zustand-demo-title">
      <header className="section-header">
        <h2 id="zustand-demo-title">Bài 1 — Zustand store có persist, tách slice</h2>
        <PreferencesBar />
      </header>
      <div className="shop-layout">
        <ProductCatalog />
        <CartSummary />
      </div>
    </section>
  );
}
