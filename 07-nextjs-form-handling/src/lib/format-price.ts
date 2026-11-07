const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatPrice(amountUsd: number): string {
  return usdFormatter.format(amountUsd);
}
