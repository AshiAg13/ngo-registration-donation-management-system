import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("PENDING");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setMessage("Invalid Transaction Reference");
      return;
    }
    let stopped = false;
    
    const check = async () => {
      try {
        const res = await api.get(`/api/donation/status?order_id=${encodeURIComponent(orderId)}`);
        const s = res.data?.status || "PENDING";
        
        if (stopped) return;
        setStatus(s);

        if (s === "SUCCESS") {
          setMessage("Transaction Verified Successfully");
          setTimeout(() => navigate("/user"), 2000);
        } else if (s === "FAILED") {
          setMessage("The payment gateway declined the transaction.");
        } else {
          // Keep polling every 2 seconds
          setTimeout(check, 2000);
        }
      } catch (e) {
        // If API fails, keep trying
        if (!stopped) setTimeout(check, 3000);
      }
    };

    check();
    return () => { stopped = true; };
  }, [orderId, navigate]);

  return (
    <div className="auth-container">
      <div className="decorative-gradient"></div>

      <div className="home-content-wrapper" style={{ maxWidth: "500px" }}>
        <header className="home-header">
          <h1 className="brand-logo">Unity<span className="accent-text">Fund</span></h1>
          <p className="hero-tagline">Verification System</p>
        </header>

        <main className="hero-card" style={{ padding: "50px 40px", textAlign: "center" }}>
          
          {status === "PENDING" && (
            <div className="status-loader-container">
              <div className="pulse-ring"></div>
              <h2 className="section-title" style={{ marginTop: "30px" }}>Verifying Payment</h2>
              <p style={{ color: "var(--text-muted)" }}>
                We are communicating with the payment gateway to confirm your contribution. Please do not refresh.
              </p>
            </div>
          )}

          {status === "SUCCESS" && (
            <div className="status-success-container">
              <div style={{ fontSize: "60px", color: "#10b981", marginBottom: "20px" }}>✓</div>
              <h2 className="section-title">{message}</h2>
              <p style={{ color: "var(--text-muted)" }}>
                Thank you for your generosity. Redirecting you to your dashboard...
              </p>
            </div>
          )}

          {status === "FAILED" && (
            <div className="status-failed-container">
              <div style={{ fontSize: "60px", color: "#ef4444", marginBottom: "20px" }}>✕</div>
              <h2 className="section-title">Payment Failed</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
                {message}
              </p>
              <button className="btn-primary" onClick={() => navigate("/donate")} style={{ width: "100%" }}>
                Return to Donation Page
              </button>
            </div>
          )}

          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Reference ID: {orderId}
          </div>
        </main>
      </div>
    </div>
  );
}