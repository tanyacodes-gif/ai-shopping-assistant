import { useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products")) || [
      {
        id: 1,
        name: "ASUS Vivobook 15",
        price: 55999,
        brand: "ASUS",
        rating: 4.5,
        stock: 12,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        desc: "Best for coding, college and daily productivity."
      },
      {
        id: 2,
        name: "Lenovo IdeaPad Slim",
        price: 48999,
        brand: "Lenovo",
        rating: 4.3,
        stock: 18,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        desc: "Budget-friendly laptop for students."
      },
      {
        id: 3,
        name: "HP Pavilion Gaming",
        price: 59999,
        brand: "HP",
        rating: 4.4,
        stock: 7,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800",
        desc: "Good for coding, gaming and multitasking."
      }
    ]
  );
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    image: "",
    desc: ""
  });

  const recommend = () => {
    const budget = query.match(/\d+/)?.[0] || 60000;
    const matched = products.filter((p) => p.price <= Number(budget));
    setResult(matched);
  };

  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);

    if (!exists) {
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      alert("Added to wishlist");
    } else {
      alert("Already in wishlist");
    }
  };
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
  
    setWishlist(updatedWishlist);
  
    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
  
    setCart(updatedCart);
  
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  }; 

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
  
    const product = {
      id: Date.now(),
      name: newProduct.name,
      brand: newProduct.brand,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      image: newProduct.image,
      desc: newProduct.desc,
      rating: 4.0
    };
  
    const updatedProducts = [...products, product];
  
    setProducts(updatedProducts);
  
    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );
  
    setNewProduct({
      name: "",
      brand: "",
      price: "",
      stock: "",
      image: "",
      desc: ""
    });
  
    alert("Product Added Successfully");
  };
  const deleteProduct = (id) => {
    const updatedProducts = products.filter(
      (p) => p.id !== id
    );
  
    setProducts(updatedProducts);
  
    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );
  };
  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);

    if (!exists) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      ocalStorage.setItem("cart", JSON.stringify(updatedCart));
      alert("Added to cart");
    } else {
      alert("Already in cart");
    }
  };

  const Card = ({ p }) => (
    <div className="card">
      <img src={p.image} />
      <h3>{p.name}</h3>
      <p>{p.desc}</p>
      <p>{p.brand} • {p.rating}⭐ • Stock {p.stock}</p>
      <h2>₹{p.price.toLocaleString()}</h2>

      <div className="actions">
        <button onClick={() => addToWishlist(p)}>Wishlist</button>
        <button onClick={() => addToCart(p)}>Cart</button>
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
          <button onClick={() => setPage("wishlist")}>
            Wishlist ({wishlist.length})
          </button>
          <button onClick={() => setPage("cart")}>
            Cart ({cart.length})
          </button>
          <button onClick={() => setPage("admin")}>Admin</button>
        </div>
      </nav>

      {page === "home" && (
        <section className="hero">
          <p className="tag">AI POWERED SHOPPING PLATFORM</p>
          <h1>Smart Shopping Powered By AI</h1>
          <p>
            Product recommendations, budget filtering, wishlist, cart and admin
            controls.
          </p>
          <button onClick={() => setPage("assistant")}>
            Start Recommendation
          </button>
        </section>
      )}

      {page === "products" && (
        <section className="panel">
          <h1>Products</h1>

          <div className="grid">
            {products.map((p) => (
              <Card key={p.id} p={p} />
            ))}
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

          {result && (
            <div className="result">
              <h2>AI Explanation</h2>
              <p>
                Based on your budget and use case, these products are the best
                matches.
              </p>

              <div className="grid">
                {result.map((p) => (
                  <Card key={p.id} p={p} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {page === "wishlist" && (
        <section className="panel">
          <h1>Wishlist</h1>

          {wishlist.length === 0 ? (
            <p>No saved products yet.</p>
          ) : (
            <div className="grid">
              {wishlist.map((p) => (
                <div key={p.id}>
                <Card p={p} />
              
                <button
                  onClick={() => removeFromWishlist(p.id)}
                >
                  Remove
                </button>
              </div>
              ))}
            </div>
          )}
        </section>
      )}

      {page === "cart" && (
        <section className="panel">
          <h1>Cart</h1>

          {cart.length === 0 ? (
            <p>No cart items yet.</p>
          ) : (
            <div className="grid">
              {cart.map((p) => (
                <div key={p.id}>
                <Card p={p} />
              
                <button
                  onClick={() => removeFromCart(p.id)}
                >
                  Remove
                </button>
              </div>
              ))}
            </div>
          )}
        </section>
      )}

{page === "admin" && (
  <section className="panel">
    <h1>Admin Dashboard</h1>

    <input
      placeholder="Product Name"
      value={newProduct.name}
      onChange={(e) =>
        setNewProduct({
          ...newProduct,
          name: e.target.value
        })
      }
    />

    <input
      placeholder="Brand"
      value={newProduct.brand}
      onChange={(e) =>
        setNewProduct({
          ...newProduct,
          brand: e.target.value
        })
      }
    />

    <input
      placeholder="Price"
      value={newProduct.price}
      onChange={(e) =>
        setNewProduct({
          ...newProduct,
          price: e.target.value
        })
      }
    />

    <input
      placeholder="Stock"
      value={newProduct.stock}
      onChange={(e) =>
        setNewProduct({
          ...newProduct,
          stock: e.target.value
        })
      }
    />

    <input
      placeholder="Image URL"
      value={newProduct.image}
      onChange={(e) =>
        setNewProduct({
          ...newProduct,
          image: e.target.value
        })
      }
    />

    <input
      placeholder="Description"
      value={newProduct.desc}
      onChange={(e) =>
        setNewProduct({
          ...newProduct,
          desc: e.target.value
        })
      }
    />

    <button onClick={addProduct}>
      Add Product
    </button>

    <h2 style={{ marginTop: "30px" }}>
      Existing Products
    </h2>

    {products.map((p) => (
      <div
        key={p.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px 0"
        }}
      >
        <span>
          {p.name} - ₹{p.price}
        </span>

        <button
          onClick={() => deleteProduct(p.id)}
        >
          Delete
        </button>
      </div>
    ))}
  </section>
)}
    </div>
  );
}

export default App;