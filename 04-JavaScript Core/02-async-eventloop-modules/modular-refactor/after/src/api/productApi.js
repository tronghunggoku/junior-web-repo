const MOCK_PRODUCTS = [
  { id: 1, name: 'Bàn phím cơ Keychron Q1 Pro', price: 199, category: 'keyboard', rating: 4.9, stock: 12 },
  { id: 2, name: 'Chuột Logitech MX Master 3S', price: 99, category: 'mouse', rating: 4.8, stock: 25 },
  { id: 3, name: 'Màn hình Dell UltraSharp 27 4K', price: 549, category: 'monitor', rating: 4.9, stock: 8 },
  { id: 4, name: 'Tai nghe Sony WH-1000XM5', price: 349, category: 'audio', rating: 4.7, stock: 15 },
  { id: 5, name: 'Bàn phím Akko Mod007 v3 Dragon', price: 139, category: 'keyboard', rating: 4.6, stock: 18 },
  { id: 6, name: 'Chuột Gaming Razer Viper V3', price: 149, category: 'mouse', rating: 4.8, stock: 20 },
];

export async function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_PRODUCTS]);
    }, 300);
  });
}

export async function fetchCategories() {
  const products = await fetchProducts();
  const categories = ['all', ...new Set(products.map((p) => p.category))];
  return categories;
}
