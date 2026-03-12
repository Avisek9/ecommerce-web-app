import { useState, useEffect } from "react";
import API from "../axios";

export default function Login({ onLogin }) {
  
  useEffect(() => {
    document.body.className = "light-theme";
  }, []);
  const [tab, setTab]           = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("USER");
  const [error, setError]       = useState("");
  const [info, setInfo]         = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);

    
    const token = btoa(`${username}:${password}`);

    try {
      
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Basic ${token}` },
      });

      
      sessionStorage.setItem("basicAuth", token);
      sessionStorage.setItem("authUser", JSON.stringify(res.data));
      onLogin(res.data);
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);

    try {
      await API.post("/auth/register", { username, password, role });
      setInfo("Account created! You can now sign in.");
      setTab("login");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm" style={{ width: 380 }}>
        <div className="card-body p-4">
          <h4 className="fw-bold mb-1">🛒 ShopApp</h4>
          <p className="text-muted small mb-4">Your one-stop shop</p>

          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button className={`nav-link ${tab === "login" ? "active" : ""}`}
                onClick={() => { setTab("login"); setError(""); setInfo(""); }}>
                Sign in
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === "register" ? "active" : ""}`}
                onClick={() => { setTab("register"); setError(""); setInfo(""); }}>
                Register
              </button>
            </li>
          </ul>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {info  && <div className="alert alert-success py-2 small">{info}</div>}

          {tab === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Username</label>
                <input className="form-control" value={username} autoFocus
                  onChange={e => setUsername(e.target.value)} placeholder="your_username" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input className="form-control" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Signing in..." : "Sign in →"}
              </button>
              <p className="text-muted small text-center mt-3 mb-0">
                Demo: <code>admin / admin123</code> or <code>user / user123</code>
                </p>
                <p className="text-muted text-center mb-0" style={{ fontSize: 11 }}>
                  ℹ️ First time? Log in as <strong>admin</strong> and add a few products with images to populate the catalog. This app uses a local H2 database.
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Username</label>
                <input className="form-control" value={username} autoFocus
                  onChange={e => setUsername(e.target.value)} placeholder="your_username" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input className="form-control" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="min 4 characters" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Account type</label>
                <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="USER">User — can browse and order</option>
                  <option value="ADMIN">Admin — can manage products</option>
                </select>
              </div>
              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
