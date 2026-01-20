import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      // Showing a success state before redirecting
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
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
          <p className="hero-tagline">Start Your Giving Journey</p>
        </header>

        <main className="hero-card" style={{ maxWidth: "500px", margin: "0 auto", padding: "50px 40px" }}>
          <section className="hero-intro" style={{ marginBottom: "30px" }}>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>Create Account</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Join our community of transparent giving and make a real impact.
            </p>
          </section>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="custom-input"
              />
            </div>

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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="custom-input"
              />
            </div>

            {message && (
              <div className={message.includes("successful") ? "success-banner" : "error-banner"}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
              Create Account
            </button>
          </form>

          <footer className="auth-footer-text" style={{ marginTop: "25px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Already part of the mission?{" "}
              <span className="auth-link" onClick={() => navigate("/login")}>
                Sign In
              </span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Register;