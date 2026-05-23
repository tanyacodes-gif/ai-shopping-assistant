import products from "../data/products.js";

export const getProducts = async (req, res) => {
  try {
    const { category, maxPrice, brand } = req.query;

    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = products.find(
      (p) => p.id === Number(req.params.id)
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product"
    });
  }
};