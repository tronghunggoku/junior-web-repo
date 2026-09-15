function createCounter(initialValue = 0, step = 1) {
  let count = initialValue;
  const history = [initialValue];

  return {
    increment() {
      count += step;
      history.push(count);
      return count;
    },
    decrement() {
      count -= step;
      history.push(count);
      return count;
    },
    reset() {
      count = initialValue;
      history.push(count);
      return count;
    },
    getValue() {
      return count;
    },
    getHistory() {
      return [...history];
    }
  };
}

const counterA = createCounter(10, 2);
console.log('Giá trị ban đầu:', counterA.getValue());
console.log('Tăng lần 1:', counterA.increment());
console.log('Tăng lần 2:', counterA.increment());
console.log('Giảm lần 1:', counterA.decrement());
console.log('Lịch sử thay đổi:', counterA.getHistory());
console.log('Truy cập count trực tiếp:', counterA.count);

function memoize(fn) {
  const cache = new Map();
  let hits = 0;
  let misses = 0;

  const memoizedFn = function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      hits++;
      console.log(`[Cache Hit] args = ${key}`);
      return cache.get(key);
    }

    misses++;
    console.log(`[Cache Miss] args = ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoizedFn.getStats = () => ({ hits, misses, cacheSize: cache.size });
  memoizedFn.clearCache = () => cache.clear();

  return memoizedFn;
}

const heavyCalculation = (n) => {
  let total = 0;
  for (let i = 1; i <= n * 100000; i++) {
    total += (i % 2 === 0 ? 1 : -1);
  }
  return n * n;
};

const memoizedCalc = memoize(heavyCalculation);

console.time('Lần gọi 1 (n=50)');
console.log('Kết quả 1:', memoizedCalc(50));
console.timeEnd('Lần gọi 1 (n=50)');

console.time('Lần gọi 2 (n=50)');
console.log('Kết quả 2:', memoizedCalc(50));
console.timeEnd('Lần gọi 2 (n=50)');

console.time('Lần gọi 3 (n=80)');
console.log('Kết quả 3:', memoizedCalc(80));
console.timeEnd('Lần gọi 3 (n=80)');

console.log('Thống kê Cache:', memoizedCalc.getStats());

function createCartStore() {
  let items = [];

  return {
    addItem(product) {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        items.push({ ...product, quantity: product.quantity || 1 });
      }
    },

    updateQuantity(productId, quantity) {
      if (quantity <= 0) {
        this.removeItem(productId);
        return;
      }
      items = items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    },

    removeItem(productId) {
      items = items.filter((item) => item.id !== productId);
    },

    getTotalPrice(discountRate = 0) {
      const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const discount = subtotal * discountRate;
      return {
        subtotal,
        discount,
        total: subtotal - discount
      };
    },

    filterItems(predicate) {
      return items.filter(predicate);
    },

    getItems() {
      return items.map((item) => ({ ...item }));
    }
  };
}

const cart = createCartStore();
cart.addItem({ id: 1, name: 'Bàn phím cơ Custom', price: 150, quantity: 1 });
cart.addItem({ id: 2, name: 'Chuột Gaming không dây', price: 90, quantity: 2 });
cart.addItem({ id: 3, name: 'Tai nghe chụp tai ANC', price: 200, quantity: 1 });

console.log('Danh sách sản phẩm trong giỏ:');
console.table(cart.getItems());

console.log('Tổng hóa đơn (giảm giá 10%):', cart.getTotalPrice(0.1));

cart.updateQuantity(2, 3);

const expensiveItems = cart.filterItems((item) => item.price * item.quantity >= 200);
console.log('Món hàng có tổng giá trị >= 200:');
console.table(expensiveItems);

function createLogger(prefix) {
  return function (level) {
    return function (message, details = null) {
      const timestamp = new Date().toISOString();
      const output = `[${timestamp}] [${prefix.toUpperCase()}] [${level.toUpperCase()}]: ${message}`;
      if (details) {
        console.log(output, details);
      } else {
        console.log(output);
      }
    };
  };
}

const appLogger = createLogger('OrderService');
const logInfo = appLogger('INFO');
const logError = appLogger('ERROR');

logInfo('Khởi động dịch vụ xử lý đơn hàng thành công.');
logError('Thanh toán thất bại', { orderId: 'ORD-9988', reason: 'Thẻ hết hạn' });
