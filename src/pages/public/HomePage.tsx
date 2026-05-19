import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="stack" style={{ gap: '60px' }}>
      {/* Hero Section */}
      <section className="heroSection">
        <img src="/hero-tailor.png" alt="Bespoke Tailoring" className="heroImage" />
        <div className="heroContent">
          <h1 className="heroTitle">Bespoke Tailoring & Alterations, Delivered.</h1>
          <p className="heroSubtitle">
            Experience the luxury of perfectly fitted garments without leaving your home. Our master tailors in Hanamkonda bring precision, style, and a 1-day turnaround to your doorstep.
          </p>
          <div className="btnRow">
            <Link to="/signup/customer" className="luxuryBtn" style={{ padding: '16px 32px', fontSize: '18px' }}>
              Book a Tailor Now
            </Link>
            <Link to="/tailors" className="ghostBtn" style={{ padding: '16px 32px', fontSize: '18px', color: 'white', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.3)' }}>
              View Our Tailors
            </Link>
          </div>
          <div className="heroTrust">
            <span>✓ Verified Master Tailors</span>
            <span>✓ Secure Escrow Payments</span>
            <span>✓ Doorstep Pickup & Delivery</span>
          </div>
        </div>
      </section>

      {/* 1-Day Delivery Promise Section */}
      <section className="promiseSection">
        <h2>The 24-Hour Promise</h2>
        <p>
          We know you need your favorite garments back quickly. That’s why we offer an exclusive <strong>1-Day Express Delivery</strong> for standard alterations and repairs. Trust us to deliver speed without compromising on the immaculate quality of your fit.
        </p>
      </section>

      {/* Services Section */}
      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px', letterSpacing: '-1px' }}>Our Expertise</h2>
        <div className="grid three">
          <article className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✂️</div>
            <h3 className="h3">Expert Alterations</h3>
            <p className="muted" style={{ marginTop: '12px' }}>
              Precision alterations for suits, dresses, and everyday wear to ensure your garments fit you flawlessly.
            </p>
          </article>
          <article className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🧵</div>
            <h3 className="h3">Bespoke Stitching</h3>
            <p className="muted" style={{ marginTop: '12px' }}>
              Custom-made garments crafted from scratch to your exact measurements and style preferences.
            </p>
          </article>
          <article className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
            <h3 className="h3">Repairs & Restoration</h3>
            <p className="muted" style={{ marginTop: '12px' }}>
              Breathe new life into your favorite clothes with our meticulous repair and restoration services.
            </p>
          </article>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px', letterSpacing: '-1px' }}>Loved by Customers</h2>
        <div className="reviewGrid">
          <div className="reviewCard">
            <div className="stars">★★★★★</div>
            <p className="reviewText">
              "Absolutely phenomenal service! The tailor arrived right on time for pickup, and my suit was altered to perfection and returned within 24 hours just as promised. Worth every penny."
            </p>
            <div className="reviewerName">— Rajesh M., Hanamkonda</div>
          </div>
          <div className="reviewCard">
            <div className="stars">★★★★★</div>
            <p className="reviewText">
              "I needed an urgent alteration for a wedding dress. Smart Tailor handled it with such professionalism. The fit is unbelievable and the doorstep service is a lifesaver."
            </p>
            <div className="reviewerName">— Sneha K., Warangal</div>
          </div>
          <div className="reviewCard">
            <div className="stars">★★★★★</div>
            <p className="reviewText">
              "Premium quality stitching. The master tailor really understood what I wanted for my bespoke shirt. The fabric feels great and the stitching is world-class."
            </p>
            <div className="reviewerName">— Vikram S., Hanamkonda</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ textAlign: 'center', padding: '40px', background: 'var(--card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Ready for a perfect fit?</h2>
        <p className="muted" style={{ marginBottom: '24px', fontSize: '18px' }}>Join hundreds of satisfied customers experiencing the new standard in tailoring.</p>
        <Link to="/signup/customer" className="luxuryBtn" style={{ padding: '16px 32px', fontSize: '18px' }}>
          Get Started Today
        </Link>
      </section>
    </div>
  )
}
