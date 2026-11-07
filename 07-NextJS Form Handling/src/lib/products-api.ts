/**
 * Data layer gọi API thật của dummyjson — chỉ chạy trên server (Server Components / Server Actions).
 * Mỗi fetch khai báo `next.revalidate` để Data Cache của Next.js tự làm mới (ISR).
 */
const API_BASE_URL = 'https://dummyjson.com';
const PRODUCT_FIELDS = 'id,title,description,price,rating,stock,brand,category,thumbnail,images';

/** Thời gian làm mới dữ liệu sản phẩm (giây) — dùng chung cho fetch cache. */
export const PRODUCTS_REVALIDATE_SECONDS = 3600;

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
};

type ProductListResponse = { products: Product[]; total: number };

/**
 * @param revalidate - `false` = cache vĩnh viễn (trang SSG thuần); số giây = ISR.
 * Lưu ý: revalidate của trang = giá trị NHỎ NHẤT giữa route config và các fetch bên trong.
 */
export async function getProducts(
  limit = 24,
  revalidate: number | false = PRODUCTS_REVALIDATE_SECONDS,
): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&select=${PRODUCT_FIELDS}`, {
    next: { revalidate, tags: ['products'] },
  });
  if (!response.ok) throw new Error(`Không tải được danh sách sản phẩm (HTTP ${response.status})`);
  const data = (await response.json()) as ProductListResponse;
  return data.products;
}

/** Trả về `null` khi id không tồn tại (404) để trang gọi `notFound()`. */
export async function getProduct(id: string | number): Promise<Product | null> {
  // Chặn id rác trước khi gọi API (vd: /products/abc)
  if (!/^\d+$/.test(String(id))) return null;

  const response = await fetch(`${API_BASE_URL}/products/${id}?select=${PRODUCT_FIELDS}`, {
    next: { revalidate: PRODUCTS_REVALIDATE_SECONDS, tags: ['products', `product-${id}`] },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Không tải được sản phẩm #${id} (HTTP ${response.status})`);
  return (await response.json()) as Product;
}
