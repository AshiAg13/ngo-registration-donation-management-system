import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function UserDashboard() {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/api/donation/my-donations");
        setDonations(res.data);
      } catch (err) {
        setError("Failed to load donation history");
      }
    };
    fetchDonations();
  }, []);

  // Calculate Total Impact
  const totalContributed = donations
    .filter(d => d.status === "SUCCESS")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="auth-container">
      <div className="decorative-gradient"></div>

      <div className="home-content-wrapper" style={{ maxWidth: "1000px" }}>
        {/* Navigation / Header */}
        <header className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <h1 
          className="brand-logo" 
          onClick={() => navigate("/")} 
          style={{ cursor: "pointer", margin: 0, fontSize: "1.8rem" }}
        >
          Unity<span className="accent-text">Fund</span>
        </h1>
        <span onClick={handleLogout} className="auth-link">
          Logout
        </span>
      </header>

        <main className="hero-card" style={{ textAlign: "left", padding: "40px" }}>
          <section className="user-profile-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>Welcome, {name}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>{email}</p>
            </div>
            <button className="btn-primary" onClick={() => navigate("/donate")}>
              Make a New Donation
            </button>
          </section>

          {/* Quick Stats */}
          <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
            <div style={{ flex: 1, padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <small className="value-label">Total Impact</small>
              <h2 style={{ margin: 0, color: "var(--primary)" }}>₹ {totalContributed.toLocaleString('en-IN')}</h2>
            </div>
            <div style={{ flex: 1, padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <small className="value-label">Donation Count</small>
              <h2 style={{ margin: 0 }}>{donations.filter(d => d.status === "SUCCESS").length}</h2>
            </div>
          </div>

          <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Contribution History</h3>

          {error && <div className="error-banner">{error}</div>}

          {/* Scrollable Table Container */}
          <div style={{ maxHeight: "400px", overflowY: "auto", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <table width="100%" style={{ borderCollapse: "collapse", background: "#fff" }}>
              <thead style={{ position: "sticky", top: 0, background: "#f1f5f9", zIndex: 1 }}>
                <tr>
                  <th style={{ padding: "15px", textAlign: "left", fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Amount</th>
                  <th style={{ padding: "15px", textAlign: "left", fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Status</th>
                  <th style={{ padding: "15px", textAlign: "left", fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                      You haven't made any donations yet.
                    </td>
                  </tr>
                ) : (
                  donations.map((d) => (
                    <tr key={d._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "15px", fontWeight: "600" }}>₹ {d.amount}</td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ 
                          padding: "5px 12px", 
                          borderRadius: "20px", 
                          fontSize: "0.75rem", 
                          fontWeight: "700",
                          background: d.status === "SUCCESS" ? "#dcfce7" : d.status === "FAILED" ? "#fee2e2" : "#fef9c3",
                          color: d.status === "SUCCESS" ? "#166534" : d.status === "FAILED" ? "#991b1b" : "#854d0e"
                        }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        {new Date(d.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        <footer className="footer-small">
          Logged in as a contributor to UnityFund.
        </footer>
      </div>
    </div>
  );
}

export default UserDashboard;