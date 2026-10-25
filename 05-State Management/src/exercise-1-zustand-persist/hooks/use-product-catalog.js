import { useEffect, useState } from 'react';
import { fetchDummyJson } from '../../shared/api/dummyjson-client.js';

/**
 * Lấy danh sách sản phẩm thật. Đây là SERVER state nên KHÔNG đưa vào Zustand store
 * (store chỉ giữ CLIENT state: giỏ hàng, tuỳ chọn). Bài 06 sẽ thay hook này bằng TanStack Query.
 */
export function useProductCatalog(limit = 12) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');

    fetchDummyJson(`/products?limit=${limit}&select=id,title,price,thumbnail,category`, {
      signal: controller.signal,
    })
      .then((data) => {
        setProducts(data.products);
        setStatus('success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // component unmount — bỏ qua
        setError(err.message);
        setStatus('error');
      });

    return () => controller.abort();
  }, [limit]);

  return { products, status, error };
}
