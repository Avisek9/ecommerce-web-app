import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [authUser, setAuthUser] = useState(() => {
    // Restore session if credentials still in sessionStorage
    const stored = sessionStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });

  const handleCategorySelect = (category) => setSelectedCategory(category);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleLogin = (user) => setAuthUser(user);

  const handleLogout = () => {
    sessionStorage.removeItem("basicAuth");
    sessionStorage.removeItem("authUser");
    setAuthUser(null);
    setCart([]);
  };

  if (!authUser) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdmin = authUser.role === "ADMIN";

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar
          onSelectCategory={handleCategorySelect}
          authUser={authUser}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={
            <Home addToCart={addToCart} selectedCategory={selectedCategory} />
          } />
          {/* Only admins can access add/update product pages */}
          <Route path="/add_product" element={
            isAdmin ? <AddProduct /> : <Navigate to="/" replace />
          } />
          <Route path="/product" element={<Product />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/update/:id" element={
            isAdmin ? <UpdateProduct /> : <Navigate to="/" replace />
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
