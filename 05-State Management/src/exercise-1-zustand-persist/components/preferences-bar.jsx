import { useShopStore } from '../store/shop-store.js';
import { selectCartCount } from '../store/shop-selectors.js';
import { SUPPORTED_CURRENCIES } from '../store/slices/preferences-slice.js';

export function PreferencesBar() {
  const currency = useShopStore((state) => state.currency);
  const theme = useShopStore((state) => state.theme);
  const setCurrency = useShopStore((state) => state.setCurrency);
  const toggleTheme = useShopStore((state) => state.toggleTheme);
  const cartCount = useShopStore(selectCartCount);

  return (
    <div className="preferences-bar">
      <label>
        Tiền tệ{' '}
        <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
          {SUPPORTED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="ghost" onClick={toggleTheme}>
        Theme: {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
      </button>
      <span className="badge">🛒 {cartCount}</span>
    </div>
  );
}
