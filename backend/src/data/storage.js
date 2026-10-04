const fs = require('fs');
const path = require('path');
const { initialProducts, initialOrders } = require('./seedData');

const DB_FILE = path.join(__dirname, 'db.json');

class Storage {
  constructor() {
    this.init(true);
  }

  init(forceReset = false) {
    if (forceReset || !fs.existsSync(DB_FILE)) {
      const data = {
        products: initialProducts,
        orders: initialOrders
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    }
  }

  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.init(true);
      }
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading database file:', err.message);
      const data = { products: initialProducts, orders: initialOrders };
      this.write(data);
      return data;
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  getProducts() {
    return this.read().products || [];
  }

  getOrders() {
    return this.read().orders || [];
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id.toLowerCase() === id.toLowerCase());
  }

  saveOrder(newOrder) {
    const data = this.read();
    data.orders.unshift(newOrder);
    this.write(data);
    return newOrder;
  }

  updateOrderStatus(id, newStatus) {
    const data = this.read();
    const index = data.orders.findIndex(o => o.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    data.orders[index].status = newStatus;
    this.write(data);
    return data.orders[index];
  }

  deleteOrder(id) {
    const data = this.read();
    const initialLength = data.orders.length;
    data.orders = data.orders.filter(o => o.id.toLowerCase() !== id.toLowerCase());
    if (data.orders.length < initialLength) {
      this.write(data);
      return true;
    }
    return false;
  }
}

module.exports = new Storage();
