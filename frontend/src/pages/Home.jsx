import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      {/* Abstract Background Element */}
      <div className="decorative-gradient"></div>

      <div className="home-content-wrapper">
        {/* Header Section */}
        <header className="home-header">
          <h1 className="brand-logo">Unity<span className="accent-text">Fund</span></h1>
          <p className="hero-tagline">Transparent Philanthropy for Global Impact</p>
        </header>

        {/* Main Hero Card */}
        <main className="hero-card">
          <section className="hero-intro">
            <h2 className="section-title">Redefining the way we give.</h2>
            <p className="hero-description">
              Our platform bridges the gap between generous donors and verified NGO missions. 
              By leveraging real-time tracking and administrative oversight, we ensure that 
              every contribution creates a measurable difference.
            </p>
          </section>

          {/* Core Values / Features */}
          <section className="values-grid">
            <div className="value-item">
              <span className="value-label">01</span>
              <h3>Security</h3>
              <p>Advanced encryption protocols protecting every financial transaction.</p>
            </div>
            <div className="value-item">
              <span className="value-label">02</span>
              <h3>Integrity</h3>
              <p>Direct oversight from verified administrators to ensure accountability.</p>
            </div>
            <div className="value-item">
              <span className="value-label">03</span>
              <h3>Clarity</h3>
              <p>Comprehensive history and status tracking for every donation made.</p>
            </div>
          </section>

          {/* Call to Action Section */}
          <footer className="home-actions">
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/login")}
            >
              Member Login
            </button>
            <button 
              className="btn-primary" 
              onClick={() => navigate("/register")}
            >
              Join the Mission
            </button>
          </footer>
        </main>

        <footer className="footer-small">
          <p>&copy; 2026 UnityFund NGO Platform. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;