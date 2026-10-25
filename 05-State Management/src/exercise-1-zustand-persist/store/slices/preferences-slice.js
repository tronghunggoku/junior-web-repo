/**
 * Preferences slice — tuỳ chọn hiển thị của người dùng (tiền tệ, chủ đề).
 * Tách riêng khỏi cart vì vòng đời khác nhau: clear giỏ hàng không được
 * làm mất tuỳ chọn của người dùng.
 */
export const SUPPORTED_CURRENCIES = ['USD', 'VND'];
export const SUPPORTED_THEMES = ['light', 'dark'];

export const createPreferencesSlice = (set) => ({
  currency: 'USD',
  theme: 'light',

  setCurrency: (currency) => {
    if (!SUPPORTED_CURRENCIES.includes(currency)) return;
    set({ currency });
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
});
