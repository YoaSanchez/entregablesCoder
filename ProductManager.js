const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.lastId = 0;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("All fields are required");
      return;
    }
    const productExists = this.products.find(
      (product) => product.code === code
    );
    if (productExists) {
      console.error("Code already exists");
      return;
    }

    this.lastId++;

    const newProduct = {
      id: this.lastId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.saveProducts();

  }

  getProducts() {
    try {
      this.products = JSON.parse(fs.readFileSync(this.path));
    } catch (err) {
      console.error("Error reading products from file", err);
    }
    return this.products;
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(product => product.id === id);
  }

  updateProduct(id, updatedProduct) {
    const products = this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index >= 0) {
      this.products[index] = { ...products[index], ...updatedProduct };
      this.saveProducts();
    }
  }

  deleteProduct(id) {
    this.products = this.products.filter(product => product.id !== id);
    this.saveProducts();
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }
}

const productManager = new ProductManager('products.json');
const products = productManager.getProducts();

productManager.addProduct("Product 1", "Description 1", 10, "path/to/img", "P001", 20);
console.log(products);

productManager.addProduct("Product 2", "Description 2", 20, "path/to/img", "P002", 30);
console.log(products);

productManager.updateProduct(1, {
  title: 'New Title',
  description: 'New Description',
  price: 9.99,
  thumbnail: 'new_thumbnail.jpg',
  code: 'new_code',
  stock: 10
});
console.log(products);

productManager.deleteProduct(1);
console.log(products);


module.exports = ProductManager;
