import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

export function Footer() {
  return (
    <footer className="luxuryFooter">
      <div className="footerContainer">
        <div className="footerBrand">
          <h2>Smart Tailor</h2>
          <p>
            Bespoke craftsmanship and elegant tailoring, delivered to your door.
          </p>
        </div>
        
        <div className="footerLinks">
          <div className="footerCol">
            <h4>Services</h4>
            <Link to={ROUTES.TAILORS}>Find a Tailor</Link>
            <Link to={ROUTES.TRACK_ORDER}>Track Order</Link>
          </div>
          <div className="footerCol">
            <h4>Partners</h4>
            <Link to={ROUTES.TAILOR_SIGNUP}>Join as a Tailor</Link>
            <Link to={ROUTES.LOGIN}>Tailor Portal</Link>
          </div>
          <div className="footerCol">
            <h4>Company</h4>
            <Link to={ROUTES.CONTACT}>Contact</Link>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      
      <div className="footerBottom">
        <p>&copy; {new Date().getFullYear()} Smart Tailor. All rights reserved.</p>
        <div className="socials">
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </div>
    </footer>
  )
}
