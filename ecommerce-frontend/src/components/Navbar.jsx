import React, { useEffect, useState } from "react";
import API from "../axios";

const Navbar = ({ onSelectCategory, authUser, onLogout }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light-theme");
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const isAdmin = authUser?.role === "ADMIN";

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await API.get(`/products/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => onSelectCategory(category);

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="/">Home</a>
              </li>

              {/* Add Product only visible to admins */}
              {isAdmin && (
                <li className="nav-item">
                  <a className="nav-link" href="/add_product">Add Product</a>
                </li>
              )}

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" role="button"
                  data-bs-toggle="dropdown">Categories</a>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button className="dropdown-item"
                        onClick={() => handleCategorySelect(category)}>
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "dark-theme"
                ? <i className="bi bi-moon-fill"></i>
                : <i className="bi bi-sun-fill"></i>}
            </button>

            <div className="d-flex align-items-center cart">
              <a href="/cart" className="nav-link text-dark">
                <i className="bi bi-cart me-2" style={{ display: "flex", alignItems: "center" }}>
                  Cart
                </i>
              </a>

              <input className="form-control me-2" type="search"
                placeholder="Search" value={input}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                onFocus={() => input.length >= 1 && setShowSearchResults(true)}
              />
              {showSearchResults && (
                <ul className="list-group position-absolute" style={{ top: 60, zIndex: 999 }}>
                  {searchResults.length > 0
                    ? searchResults.map((r) => (
                        <li key={r.id} className="list-group-item">
                          <a href={`/product/${r.id}`} className="search-result-link">{r.name}</a>
                        </li>
                      ))
                    : noResults && <li className="list-group-item text-muted">No products found</li>
                  }
                </ul>
              )}
            </div>

            {/* User info + logout */}
            <div className="d-flex align-items-center ms-3 gap-2">
              <span className="small text-muted">
                {authUser?.username}
                {isAdmin && <span className="badge bg-warning text-dark ms-1">Admin</span>}
              </span>
              <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
