import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };
  
  return (
    <div className="auth-container">
      <div className="decorative-gradient"></div>

      <div className="home-content-wrapper">
        <header className="home-header">
          <h1 
            className="brand-logo" 
            onClick={() => navigate("/")} 
            style={{ cursor: "pointer" }}
          >
            Unity<span className="accent-text">Fund</span>
          </h1>
          <p className="hero-tagline">Secure Member Access</p>
        </header>

        <main className="hero-card" style={{ maxWidth: "450px", margin: "0 auto", padding: "50px 40px" }}>
          <section className="hero-intro" style={{ marginBottom: "30px" }}>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>Welcome Back</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Enter your credentials to manage your donations and impact.
            </p>
          </section>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="custom-input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="custom-input"
              />
            </div>

            {message && (
              <div className="error-banner">
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
              Sign In
            </button>
          </form>

          <footer className="auth-footer-text" style={{ marginTop: "25px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Don't have an account?{" "}
              <span className="auth-link" onClick={() => navigate("/register")}>
                Create an account
              </span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Login;