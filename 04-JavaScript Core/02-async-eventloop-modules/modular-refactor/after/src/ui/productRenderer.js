import { formatCurrency, formatCategory } from '../utils/formatters.js';

export function renderCategoryTabs(container, categories, currentCategory, onSelectCategory) {
  if (!container) return;

  container.innerHTML = categories.map((cat) => `
    <button class="tab-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
      ${formatCategory(cat)}
    </button>
  `).join('');

  container.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      onSelectCategory(btn.dataset.category);
    });
  });
}

export function renderProductCards(container, products, onAddToCart) {
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map((prod) => `
    <div class="product-card" data-id="${prod.id}">
      <div class="card-badge">${prod.category.toUpperCase()}</div>
      <h3 class="card-title">${prod.name}</h3>
      <div class="card-meta">
        <span class="rating">Rating: ${prod.rating}</span>
        <span class="stock">Còn ${prod.stock} cái</span>
      </div>
      <div class="card-footer">
        <span class="price">${formatCurrency(prod.price)}</span>
        <button class="btn-add-cart" data-id="${prod.id}">
          + Thêm giỏ
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-add-cart').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const prodId = Number(e.currentTarget.dataset.id);
      const product = products.find((p) => p.id === prodId);
      if (product) {
        onAddToCart(product);
      }
    });
  });
}

export function renderCartView(cartContainer, totalsContainer, items, totals, onUpdateQty, onRemove) {
  if (!cartContainer || !totalsContainer) return;

  if (items.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <p>Giỏ hàng đang trống</p>
      </div>
    `;
    totalsContainer.innerHTML = `
      <div class="totals-summary">
        <span>Tổng thanh toán: <strong>$0.00</strong></span>
      </div>
    `;
    return;
  }

  cartContainer.innerHTML = items.map((item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-price">${formatCurrency(item.price)}</span>
      </div>
      <div class="item-actions">
        <button class="btn-qty" data-action="decrease" data-id="${item.id}">-</button>
        <span class="qty-display">${item.quantity}</span>
        <button class="btn-qty" data-action="increase" data-id="${item.id}">+</button>
        <button class="btn-remove" data-id="${item.id}">Xóa</button>
      </div>
    </div>
  `).join('');

  totalsContainer.innerHTML = `
    <div class="totals-summary">
      <div class="summary-line">
        <span>Tổng số lượng:</span>
        <strong>${totals.totalItems} món</strong>
      </div>
      <div class="summary-line highlight">
        <span>Tổng thành tiền:</span>
        <strong>${formatCurrency(totals.subtotal)}</strong>
      </div>
    </div>
  `;

  cartContainer.querySelectorAll('.btn-qty').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const delta = btn.dataset.action === 'increase' ? 1 : -1;
      onUpdateQty(id, delta);
    });
  });

  cartContainer.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      onRemove(id);
    });
  });
}
