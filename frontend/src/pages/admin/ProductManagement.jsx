import React, { useState, useContext, useEffect } from "react";
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

const ProductManagement = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState(1);
  const [category, setCategory] = useState("Cars");
  const [brand, setBrand] = useState("");

  // Dropdown lists
  const categoryOptions = ["Cars", "T-Shirts", "Caps", "Toys", "Shoes", "Bikes"];
  const brandOptions = ["BMW", "Audi", "Ferrari", "Mercedes", " Lamborghini ", "Kia","Bugatti","Jaguar","Ford"];

  // Show/hide Add Product form
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/api/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Create product
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.isAdmin) return alert("Admin only");

    try {
      await api.post(
        "/api/products",
        {
          name,
          image,
          description,
          price: Number(price),
          countInStock: Number(countInStock),
          category,
          brand,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("✅ Product created successfully!");
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    }
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.isAdmin) return alert("Admin only");

    try {
      await api.put(
        `/api/products/${selectedProduct._id}`,
        {
          name,
          image,
          description,
          price: Number(price),
          countInStock: Number(countInStock),
          category,
          brand,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("✅ Product updated successfully!");
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("🗑️ Product deleted");
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Popup open
  const openPopup = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setImage(product.image);
    setDescription(product.description);
    setPrice(product.price);
    setCountInStock(product.countInStock);
    setCategory(product.category || "Cars");
    setBrand(product.brand || "");
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setImage("");
    setDescription("");
    setPrice("");
    setCountInStock(1);
    setCategory("Cars");
    setBrand("");
    setShowAddForm(false);
  };

  const closePopup = () => setSelectedProduct(null);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #111827, #1f2937, #3b82f6)",
        minHeight: "100vh",
        padding: "30px",
        color: "#f9fafb",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#60a5fa", marginBottom: 20 }}>
        🛠️ Admin Product Management
      </h2>

      {/* Add New Product Button */}
      {user?.isAdmin && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h3
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              cursor: "pointer",
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              borderRadius: 8,
              color: "#fff",
              transition: "0.3s",
            }}
          >
            ➕ Add New Product
          </h3>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && user?.isAdmin && (
        <form
          onSubmit={handleCreate}
          style={{
            backgroundColor: "#1f2937",
            padding: 20,
            borderRadius: 10,
            maxWidth: 700,
            margin: "0 auto 40px auto",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required style={inputStyle} />
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required style={inputStyle} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required style={{ ...inputStyle, height: 80 }} />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required style={inputStyle} />
          <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} placeholder="Quantity" required style={inputStyle} />

          {/* Category Dropdown */}
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Brand Dropdown */}
          <select value={brand} onChange={(e) => setBrand(e.target.value)} style={inputStyle}>
            <option value="">Select Brand</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <button type="submit" style={btnBlue}>Create Product</button>
        </form>
      )}

      {/* Product Grid */}
      <h3 style={{ textAlign: "center", marginBottom: 20, color: "#60a5fa" }}>
        🛍️ All Products
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              backgroundColor: "#1f2937",
              padding: 10,
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={() => openPopup(p)}
            />
            <p style={{ textAlign: "center", marginTop: 8, color: "#9ca3af" }}>
              {p.name} <br />
              <span style={{ color: "#3b82f6" }}>{p.brand}</span> • {p.category}
            </p>
          </div>
        ))}
      </div>

      {/* Popup for Edit */}
      {selectedProduct && (
        <div style={popupOverlay} onClick={closePopup}>
          <div style={popupBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 45%" }}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    maxHeight: 400,
                    objectFit: "cover",
                  }}
                />
              </div>

              {user?.isAdmin && (
                <form
                  onSubmit={handleUpdate}
                  style={{
                    flex: "1 1 45%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <h3>Edit Product</h3>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                  <input value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} />
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, height: 80 }} />
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
                  <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} style={inputStyle} />

                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select value={brand} onChange={(e) => setBrand(e.target.value)} style={inputStyle}>
                    <option value="">Select Brand</option>
                    {brandOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                    <button type="submit" style={btnBlue}>Update</button>
                    <button type="button" style={btnRed} onClick={() => handleDelete(selectedProduct._id)}>Delete</button>
                  </div>
                </form>
              )}
            </div>

            <button onClick={closePopup} style={{ ...btnRed, marginTop: 20 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const inputStyle = {
  width: "100%",
  padding: 8,
  borderRadius: 8,
  border: "1px solid #4b5563",
  backgroundColor: "#111827",
  color: "#f9fafb",
  outline: "none",
  fontSize: 14,
};

const btnBlue = {
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const btnRed = {
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const popupOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  overflowY: "auto",
  padding: "20px",
};

const popupBox = {
  backgroundColor: "#1f2937",
  padding: 20,
  borderRadius: 10,
  width: "90%",
  maxWidth: 900,
  color: "#fff",
  boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
};

export default ProductManagement;
