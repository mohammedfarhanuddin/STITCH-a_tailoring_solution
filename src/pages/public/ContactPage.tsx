export function ContactPage() {
  return (
    <div className="stack">
      <section className="card">
        <h1>Contact Us</h1>
        <p className="muted">Need help with booking, pickup, delivery, or disputes? Reach us here.</p>
      </section>

      <section className="grid two">
        <article className="card">
          <h2 className="h3">Customer Support</h2>
          <p className="muted">Phone: +91-90000-00000</p>
          <p className="muted">Email: support@smarttailor.in</p>
          <p className="muted">Hours: 9:00 AM - 8:00 PM</p>
        </article>
        <article className="card">
          <h2 className="h3">Tailor & Partner Support</h2>
          <p className="muted">Phone: +91-90000-11111</p>
          <p className="muted">Email: partners@smarttailor.in</p>
          <p className="muted">Address: Hanamkonda, Telangana</p>
        </article>
      </section>
    </div>
  )
}

