export function filterProducts(products, category = 'all', searchQuery = '') {
  return products
    .filter((product) => category === 'all' || product.category === category)
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
}

export function sortProducts(products, sortBy = 'price-asc') {
  const cloned = [...products];
  switch (sortBy) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return cloned.sort((a, b) => b.rating - a.rating);
    default:
      return cloned;
  }
}

export function calculateTotals(cartItems) {
  return cartItems.reduce(
    (acc, item) => ({
      subtotal: acc.subtotal + item.price * item.quantity,
      totalItems: acc.totalItems + item.quantity,
    }),
    { subtotal: 0, totalItems: 0 }
  );
}
