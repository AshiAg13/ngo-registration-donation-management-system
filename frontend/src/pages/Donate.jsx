import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Donate() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const redirectToPayHere = async (donationId, amount) => {
    try {
      const amtStr = Number(amount);
      if (!isFinite(amtStr) || amtStr <= 0) throw new Error("Invalid amount");

      const hashRes = await api.post("/api/payhere/hash", {
        order_id: String(donationId),
        amount: Number(amount).toFixed(2),
        currency: "LKR", // PayHere Sandbox currency
      });

      const data = hashRes.data || {};
      const merchant_id = data.merchant_id || data.merchantId || data.merchant;
      const hash = data.hash;

      if (!merchant_id || !hash) {
        throw new Error(`Payment initialization failed: Missing hash or merchant ID`);
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";
      form.acceptCharset = "utf-8";
      form.style.display = "none";

      const fields = {
        merchant_id,
        order_id: String(donationId),
        items: "UnityFund NGO Contribution",
        amount: Number(amount).toFixed(2),
        currency: "LKR",
        hash,
        return_url: "http://localhost:5173/user",
        cancel_url: "http://localhost:5173/user",
        notify_url: "https://noncomprehending-garfield-orphreyed.ngrok-free.dev/api/payhere/notify",
        first_name: localStorage.getItem("name") || "User",
        last_name: "Donor",
        email: localStorage.getItem("email") || "donor@test.com",
        phone: "0770000000",
        address: "NGO Platform",
        city: "Colombo",
        country: "Sri Lanka",
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value ?? "";
        form.appendChild(input);
      });

      document.body.appendChild(form);
      await new Promise((res) => setTimeout(res, 200));
      form.submit();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Initialization failed");
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/donation/create", {
        amount: Number(amount),
      });

      if (!res.data || !res.data.donationId) throw new Error("Server error");
      setMessage("Connecting to secure gateway...");
      await redirectToPayHere(res.data.donationId, amount);
    } catch (error) {
      setMessage(error.message || "Donation failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="decorative-gradient"></div>

      <div className="home-content-wrapper" style={{ maxWidth: "500px" }}>
        <header className="home-header">
          <h1 className="brand-logo" onClick={() => navigate("/user")} style={{ cursor: "pointer" }}>
            Unity<span className="accent-text">Fund</span>
          </h1>
          <p className="hero-tagline">Secure Contribution Portal</p>
        </header>

        <main className="hero-card" style={{ padding: "50px 40px" }}>
          <section className="hero-intro" style={{ marginBottom: "30px", textAlign: "center" }}>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>Support the Cause</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Your contribution directly funds transparent NGO projects.
            </p>
          </section>

          <form onSubmit={handleDonate} className="auth-form">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="custom-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={loading}
                style={{ fontSize: "1.5rem", textAlign: "center", fontWeight: "700", color: "var(--primary)" }}
              />
            </div>

            {message && (
              <div className={message.includes("Connecting") ? "success-banner" : "error-banner"}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginTop: "10px" }}>
              {loading ? "Preparing Gateway..." : "Proceed to Secure Payment"}
            </button>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate("/user")}
              style={{ width: "100%" }}
            >
              Cancel and Return
            </button>
          </form>
        </main>

        <footer className="footer-small">
          All transactions are encrypted and monitored for ethical compliance.
        </footer>
      </div>
    </div>
  );
}

export default Donate;