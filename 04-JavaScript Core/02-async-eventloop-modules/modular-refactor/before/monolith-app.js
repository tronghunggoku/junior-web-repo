let globalCart = [];
let currentCategory = 'all';

function fetchProductsFromApi() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Bàn phím cơ Keychron Q1 Pro', price: 199, category: 'keyboard', rating: 4.9, stock: 12 },
        { id: 2, name: 'Chuột Logitech MX Master 3S', price: 99, category: 'mouse', rating: 4.8, stock: 25 },
        { id: 3, name: 'Màn hình Dell UltraSharp 27 4K', price: 549, category: 'monitor', rating: 4.9, stock: 8 },
        { id: 4, name: 'Tai nghe Sony WH-1000XM5', price: 349, category: 'audio', rating: 4.7, stock: 15 },
        { id: 5, name: 'Bàn phím Akko Mod007 v3', price: 139, category: 'keyboard', rating: 4.6, stock: 18 },
        { id: 6, name: 'Chuột Razer DeathAdder V3 Pro', price: 149, category: 'mouse', rating: 4.8, stock: 20 },
      ]);
    }, 400);
  });
}

function addToCart(product) {
  const item = globalCart.find((i) => i.id === product.id);
  if (item) {
    item.qty += 1;
  } else {
    globalCart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function calculateCartTotals() {
  const subtotal = globalCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = globalCart.reduce((acc, item) => acc + item.qty, 0);
  return { subtotal, totalItems };
}

function formatUSD(amount) {
  return '$' + amount.toFixed(2);
}

function renderProductList(products) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = currentCategory === 'all' 
    ? products 
    : products.filter((p) => p.category === currentCategory);

  container.innerHTML = filtered.map((p) => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p class="category">${p.category.toUpperCase()}</p>
      <div class="price">${formatUSD(p.price)}</div>
      <button onclick="window.__addToCartById(${p.id})">Thêm vào giỏ</button>
    </div>
  `).join('');
}

function renderCart() {
  const cartList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartList || !cartTotal) return;

  cartList.innerHTML = globalCart.map((item) => `
    <li>${item.name} x ${item.qty} = ${formatUSD(item.price * item.qty)}</li>
  `).join('');

  const { subtotal, totalItems } = calculateCartTotals();
  cartTotal.textContent = `Tổng (${totalItems} món): ${formatUSD(subtotal)}`;
}

let cachedProducts = [];
fetchProductsFromApi().then((data) => {
  cachedProducts = data;
  window.__addToCartById = (id) => {
    const prod = cachedProducts.find((p) => p.id === id);
    if (prod) addToCart(prod);
  };
  renderProductList(cachedProducts);
});
