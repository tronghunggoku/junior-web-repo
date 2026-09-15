export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatCategory(category) {
  if (category === 'all') return 'Tất cả sản phẩm';
  return category.charAt(0).toUpperCase() + category.slice(1);
}
