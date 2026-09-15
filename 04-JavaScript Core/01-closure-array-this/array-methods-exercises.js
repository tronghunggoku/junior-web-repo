const orders = [
  { id: 'ORD01', customer: 'An', category: 'Tech', amount: 1200, status: 'completed', items: ['Laptop', 'Mouse'] },
  { id: 'ORD02', customer: 'Bình', category: 'Fashion', amount: 300, status: 'pending', items: ['Shirt', 'Jeans'] },
  { id: 'ORD03', customer: 'Chi', category: 'Tech', amount: 450, status: 'completed', items: ['Headphones'] },
  { id: 'ORD04', customer: 'Dũng', category: 'Book', amount: 80, status: 'cancelled', items: ['Novel'] },
  { id: 'ORD05', customer: 'An', category: 'Fashion', amount: 150, status: 'completed', items: ['Shoes'] },
  { id: 'ORD06', customer: 'Bình', category: 'Tech', amount: 890, status: 'completed', items: ['Monitor'] },
  { id: 'ORD07', customer: 'Chi', category: 'Book', amount: 120, status: 'completed', items: ['Cookbook', 'Comic'] },
];

function calculateRevenueByCategory_Imperative(orderList) {
  const result = {};
  for (let i = 0; i < orderList.length; i++) {
    const order = orderList[i];
    if (order.status === 'completed') {
      if (!result[order.category]) {
        result[order.category] = 0;
      }
      result[order.category] += order.amount;
    }
  }
  return result;
}

function calculateRevenueByCategory_Declarative(orderList) {
  return orderList
    .filter((order) => order.status === 'completed')
    .reduce((acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
}

console.log('Kết quả Imperative:', calculateRevenueByCategory_Imperative(orders));
console.log('Kết quả Declarative:', calculateRevenueByCategory_Declarative(orders));

function getUniqueSoldItems_Imperative(orderList) {
  const uniqueItems = [];
  for (let i = 0; i < orderList.length; i++) {
    if (orderList[i].status === 'completed') {
      const currentItems = orderList[i].items;
      for (let j = 0; j < currentItems.length; j++) {
        if (!uniqueItems.includes(currentItems[j])) {
          uniqueItems.push(currentItems[j]);
        }
      }
    }
  }
  return uniqueItems;
}

function getUniqueSoldItems_Declarative(orderList) {
  const allItems = orderList
    .filter((order) => order.status === 'completed')
    .flatMap((order) => order.items);

  return [...new Set(allItems)];
}

console.log('Items (Imperative):', getUniqueSoldItems_Imperative(orders));
console.log('Items (Declarative):', getUniqueSoldItems_Declarative(orders));

function getVipCustomerSummary(orderList) {
  const spendingByCustomer = orderList
    .filter((o) => o.status === 'completed')
    .reduce((acc, { customer, amount }) => {
      acc[customer] = (acc[customer] || 0) + amount;
      return acc;
    }, {});

  return Object.entries(spendingByCustomer)
    .map(([customer, totalSpent]) => ({ customer, totalSpent }))
    .filter((entry) => entry.totalSpent >= 1000)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .map((vip, index) => ({
      rank: `#${index + 1}`,
      name: vip.customer,
      formattedSpent: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vip.totalSpent)
    }));
}

console.log('Bảng xếp hạng VIP:');
console.table(getVipCustomerSummary(orders));

const hasCancelledOrders = orders.some((order) => order.status === 'cancelled');
console.log('Có đơn hàng bị hủy không:', hasCancelledOrders);

const areAllOrdersExpensive = orders.every((order) => order.amount >= 50);
console.log('Tất cả đơn hàng >= 50:', areAllOrdersExpensive);

async function demoSequentialForLoop(items) {
  for (const item of items) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    console.log(`Đã xử lý phần tử: ${item}`);
  }
}

demoSequentialForLoop(['Item-A', 'Item-B', 'Item-C']);
