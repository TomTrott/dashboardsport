import "../css/Navbar.css";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const navigate = useNavigate();

  const { logout } = useAuth();

  function handleLogout() {

    logout();

    navigate("/");
  }
  return (

    <header className="navbar">

      <div
        className="navbar-logo"
        onClick={() => navigate("/dashboard")}
      >
        <div className="logo-bars">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span className="logo-text">
          SPORTSEE
        </span>
      </div>

      <nav className="navbar-menu">
        <button
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/profile")}
        >
          Mon profil
        </button>

        <div className="navbar-separator" />

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Se déconnecter
        </button>
      </nav>

    </header>
  );
}