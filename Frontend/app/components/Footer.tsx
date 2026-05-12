import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-left">
        ©Sportsee Tous droits réservés
      </div>

      <div className="footer-right">

        <button>
          Conditions générales
        </button>

        <button>
          Contact
        </button>

        <div className="footer-bars">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

    </footer>
  );
}