import { fetchProducts, fetchCategories } from './api/productApi.js';
import { filterProducts, sortProducts } from './utils/arrayHelpers.js';
import { cartStore } from './state/cartStore.js';
import {
  renderCategoryTabs,
  renderProductCards,
  renderCartView,
} from './ui/productRenderer.js';

let allProducts = [];
let activeCategory = 'all';
let currentSearch = '';
let currentSort = 'price-asc';

const categoryTabsEl = document.getElementById('category-tabs');
const productsGridEl = document.getElementById('products-grid');
const cartItemsEl = document.getElementById('cart-items-container');
const cartTotalsEl = document.getElementById('cart-totals-container');
const searchInputEl = document.getElementById('searchInput');
const sortSelectEl = document.getElementById('sortSelect');
const btnClearCartEl = document.getElementById('btnClearCart');
const loadingStateEl = document.getElementById('loadingState');

function updateProductView() {
  const filtered = filterProducts(allProducts, activeCategory, currentSearch);
  const sorted = sortProducts(filtered, currentSort);
  renderProductCards(productsGridEl, sorted, (product) => {
    cartStore.addItem(product);
  });
}

async function initApp() {
  try {
    loadingStateEl.style.display = 'block';

    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    allProducts = products;
    loadingStateEl.style.display = 'none';

    renderCategoryTabs(categoryTabsEl, categories, activeCategory, (newCategory) => {
      activeCategory = newCategory;
      renderCategoryTabs(categoryTabsEl, categories, activeCategory, null);
      updateProductView();
    });

    updateProductView();

    cartStore.subscribe((items, totals) => {
      renderCartView(
        cartItemsEl,
        cartTotalsEl,
        items,
        totals,
        (id, delta) => cartStore.updateQuantity(id, delta),
        (id) => cartStore.removeItem(id)
      );
    });

    searchInputEl.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      updateProductView();
    });

    sortSelectEl.addEventListener('change', (e) => {
      currentSort = e.target.value;
      updateProductView();
    });

    btnClearCartEl.addEventListener('click', () => {
      cartStore.clear();
    });

    console.log('Ứng dụng Modular ES Modules đã sẵn sàng.');
  } catch (error) {
    console.error('Lỗi khởi tạo ứng dụng:', error);
    loadingStateEl.innerHTML = `<p style="color: #ef4444">Không thể tải dữ liệu: ${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', initApp);
