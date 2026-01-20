import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalDonationAmount: 0 });
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // Filters State
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [donationSearch, setDonationSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, donationsRes, usersRes] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/donations"),
          api.get("/api/admin/users")
        ]);
        setStats(statsRes.data);
        setDonations(donationsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        setError("Unauthorized or server error");
      }
    };
    fetchAdminData();
  }, []);

  // Filtering Logic
  const filteredDonations = donations.filter((d) => {
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    const searchStr = donationSearch.toLowerCase();
    const matchesSearch = 
      d._id.toLowerCase().includes(searchStr) || 
      (d.user?.name || "").toLowerCase().includes(searchStr) ||
      (d.user?.email || "").toLowerCase().includes(searchStr);

    const dDate = new Date(d.createdAt).toLocaleDateString('en-CA'); 
    const matchesStartDate = !dateFilter.start || dDate >= dateFilter.start;
    const matchesEndDate = !dateFilter.end || dDate <= dateFilter.end;

    return matchesStatus && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const filteredDonationTotal = filteredDonations
    .filter(d => d.status === "SUCCESS")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const exportUsersCSV = () => {
    if (filteredUsers.length === 0) return alert("No users to export");
    const headers = ["Name", "Email", "Role", "Registered At"];
    const rows = filteredUsers.map((u) => [u.name, u.email, u.role, new Date(u.createdAt).toLocaleString()]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "filtered_users.csv"; a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="auth-container">
      <div className="decorative-gradient"></div>

      <div className="home-content-wrapper" style={{ maxWidth: "1200px", zIndex: 1 }}>
        
        {/* HEADER WITH CLICKABLE LOGO */}
        <header className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 
            className="brand-logo" 
            onClick={() => navigate("/")} 
            style={{ cursor: "pointer", margin: 0, fontSize: "1.8rem" }}
          >
            Unity<span className="accent-text">Fund</span>
          </h1>
          <span onClick={handleLogout} className="auth-link" style={{ color: "#ef4444", fontWeight: "600" }}>
            Logout
          </span>
        </header>

        <main className="hero-card" style={{ textAlign: "left", padding: "40px" }}>
          
          {/* STATS CARDS */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
            <div className="stat-card" style={{ flex: 1, padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <small className="value-label">Registered Users</small>
              <h2 style={{ margin: "5px 0 0 0" }}>{stats.totalUsers}</h2>
            </div>
            
            <div className="stat-card" style={{ flex: 1, padding: "20px", background: "#f5f3ff", borderRadius: "16px", border: "1px solid #e0e7ff" }}>
              <small className="value-label" style={{ color: "var(--primary)" }}>All-Time Funds</small>
              <h2 style={{ margin: "5px 0 0 0", color: "var(--primary)" }}>₹ {stats.totalDonationAmount.toLocaleString('en-IN')}</h2>
            </div>

            <div className="stat-card" style={{ flex: 1, padding: "20px", background: "#ecfdf5", borderRadius: "16px", border: "1px solid #a7f3d0" }}>
              <small className="value-label" style={{ color: "#047857" }}>Selected Range Total</small>
              <h2 style={{ margin: "5px 0 0 0", color: "#047857" }}>₹ {filteredDonationTotal.toLocaleString('en-IN')}</h2>
            </div>
          </div>

          {/* DONATION FILTERS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "15px", marginBottom: "25px" }}>
            <div>
              <h3 style={{ margin: "0 0 10px 0" }}>Donation Records</h3>
              <input 
                type="text" 
                placeholder="Search Order ID or Donor..." 
                className="custom-input"
                style={{ width: "250px", padding: "8px 12px" }}
                value={donationSearch}
                onChange={(e) => setDonationSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <div>
                <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="custom-input" style={{ padding: "8px" }}>
                  <option value="ALL">All</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>From</label>
                <input type="date" value={dateFilter.start} onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })} className="custom-input" style={{ padding: "7px" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>To</label>
                <input type="date" value={dateFilter.end} onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })} className="custom-input" style={{ padding: "7px" }} />
              </div>
              <button 
                onClick={() => { setStatusFilter("ALL"); setDateFilter({ start: "", end: "" }); setDonationSearch(""); }}
                className="btn-secondary" style={{ padding: "8px 15px", fontSize: "12px" }}
              >Reset</button>
            </div>
          </div>

          {/* DONATION TABLE */}
          <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "16px", marginBottom: "50px", background: "#fff" }}>
            <table width="100%" cellPadding="15" style={{ borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, background: "#f8fafc", zIndex: 1 }}>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Order ID & Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length > 0 ? filteredDonations.map((d) => (
                  <tr key={d._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td>{d.user?.name || "User"}<br/><small>{d.user?.email}</small></td>
                    <td style={{ fontWeight: "700" }}>₹ {d.amount}</td>
                    <td>
                      <span style={{ 
                        padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                        background: d.status === "SUCCESS" ? "#dcfce7" : "#fee2e2",
                        color: d.status === "SUCCESS" ? "#166534" : "#991b1b"
                      }}>{d.status}</span>
                    </td>
                    <td><small>{d._id}</small><br/>{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No matching records.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* USER MANAGEMENT */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3>User Management</h3>
            <button onClick={exportUsersCSV} className="btn-primary" style={{ background: "#6366f1", padding: "10px 20px" }}>Export Users (CSV)</button>
          </div>
          <input 
            type="text" placeholder="Search users..." className="custom-input"
            style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}
            value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
          />
          <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "16px", background: "#fff" }}>
            <table width="100%" cellPadding="15" style={{ borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, background: "#f8fafc", zIndex: 1 }}>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ fontWeight: "600" }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span style={{ background: "#e0e7ff", color: "#4338ca", padding: "4px 8px", borderRadius: "5px", fontSize: "11px" }}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;