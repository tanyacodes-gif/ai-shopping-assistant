import { useState } from "react";

function App() {
  const defaultProducts = [
    {
      id: 1,
      name: "ASUS Vivobook 15",
      brand: "ASUS",
      category: "Laptop",
      price: 55999,
      rating: 4.5,
      stock: 12,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      desc: "Best for coding, college and daily productivity."
    },
    {
      id: 2,
      name: "Lenovo IdeaPad Slim",
      brand: "Lenovo",
      category: "Laptop",
      price: 48999,
      rating: 4.3,
      stock: 18,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      desc: "Budget-friendly laptop for students."
    },
    {
      id: 3,
      name: "HP Pavilion Gaming",
      brand: "HP",
      category: "Laptop",
      price: 59999,
      rating: 4.4,
      stock: 7,
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800",
      desc: "Good for coding, gaming and multitasking."
    }
  ];

  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products")) || defaultProducts
  );
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    image: "",
    desc: ""
  });

  const saveProducts = (items) => {
    setProducts(items);
    localStorage.setItem("products", JSON.stringify(items));
  };

  const login = () => {
    const loggedUser = {
      name: form.name || "Tanya",
      email: form.email,
      token: "fake-jwt-token",
      role: form.email.includes("admin") ? "admin" : "user"
    };
    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setPage("home");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const recommend = () => {
    const budget = query.match(/\d+/)?.[0] || 60000;
    const matched = products
      .filter((p) => p.price <= Number(budget))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    setAiResult({
      budget,
      products: matched,
      best: matched[0]
    });
  };

  const addWishlist = (product) => {
    const updated = [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const addProduct = () => {
    const item = {
      ...newProduct,
      id: Date.now(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      rating: Number(newProduct.rating)
    };
    saveProducts([...products, item]);
    setNewProduct({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      rating: "",
      image: "",
      desc: ""
    });
  };

  const deleteProduct = (id) => {
    saveProducts(products.filter((p) => p.id !== id));
  };

  const ProductCard = ({ product }) => (
    <div className="card">
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.desc}</p>
      <p>{product.brand} • {product.rating}⭐ • Stock {product.stock}</p>
      <h2>₹{product.price.toLocaleString()}</h2>
      <div className="actions">
        <button onClick={() => addWishlist(product)}>Wishlist</button>
        <button onClick={() => addCart(product)}>Cart</button>
      </div>
    </div>
  );

  return (
    <div className="app">
      <nav>
        <h2 onClick={() => setPage("home")}>ShopWise AI</h2>
        <div>
          <button onClick={() => setPage("products")}>Products</button>
          <button onClick={() => setPage("assistant")}>AI Assistant</button>
          <button onClick={() => setPage("wishlist")}>Wishlist</button>
          <button onClick={() => setPage("cart")}>Cart</button>
          <button onClick={() => setPage("admin")}>Admin</button>
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={() => setPage("login")}>Login</button>
          )}
        </div>
      </nav>

      {page === "home" && (
        <section className="hero">
          <p className="tag">AI POWERED SHOPPING PLATFORM</p>
          <h1>Smart Shopping Powered By AI</h1>
          <p className="sub">
            Get product recommendations, comparison, budget filtering and AI explanations.
          </p>
          <button onClick={() => setPage("assistant")}>Start Recommendation</button>
        </section>
      )}

      {page === "login" && (
        <section className="panel small">
          <h1>Login / Signup</h1>
          <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button onClick={login}>Continue</button>
          <p>Use email containing admin to access admin role.</p>
        </section>
      )}

      {page === "products" && (
        <section className="panel">
          <h1>Products</h1>
          <div className="grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {page === "assistant" && (
        <section className="panel">
          <h1>AI Shopping Assistant</h1>
          <textarea
            placeholder="I need a laptop under ₹60,000 for coding and college"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={recommend}>Get AI Recommendation</button>

          {aiResult && (
            <div className="result">
              <h2>AI Explanation</h2>
              <p>
                Based on your budget ₹{aiResult.budget}, these products match your use case.
                The recommendation considers price, rating, stock and student/coding suitability.
              </p>
              <h3>Best Choice: {aiResult.best?.name}</h3>
              <div className="grid">
                {aiResult.products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </section>
      )}

      {page === "wishlist" && (
        <section className="panel">
          <h1>Wishlist</h1>
          <div className="grid">
            {wishlist.map((p, i) => <ProductCard key={i} product={p} />)}
          </div>
        </section>
      )}

      {page === "cart" && (
        <section className="panel">
          <h1>Cart</h1>
          <div className="grid">
            {cart.map((p, i) => <ProductCard key={i} product={p} />)}
          </div>
        </section>
      )}

      {page === "admin" && (
        <section className="panel">
          <h1>Admin Product Management</h1>
          <div className="form">
            {Object.keys(newProduct).map((key) => (
              <input
                key={key}
                placeholder={key}
                value={newProduct[key]}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, [key]: e.target.value })
                }
              />
            ))}
          </div>
          <button onClick={addProduct}>Add Product</button>

          <div className="table">
            {products.map((p) => (
              <div className="row" key={p.id}>
                <span>{p.name}</span>
                <span>₹{p.price}</span>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;