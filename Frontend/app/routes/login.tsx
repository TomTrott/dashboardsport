import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../css/Login.css";

import BannerLogin from "../../assets/Bannierelogin.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();

    const data = await loginUser(username, password);

    login(data.token);
    navigate("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-logo">
  <div className="logo-bars">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>

  <span className="logo-text">SPORTSEE</span>
</div>

        <div className="login-card">
          <h1 className="login-title">
            Transformez
            <br />
            vos stats en résultats
          </h1>

          <h2 className="login-subtitle">Se connecter</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Adresse email</label>

            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Mot de passe</label>

            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Se connecter</button>
          </form>

          <p className="forgot-password">Mot de passe oublié ?</p>
        </div>
      </section>

      <section className="login-right">
        <img src={BannerLogin} alt="Sportsee login banner" />

        <div className="login-bubble">
          Analysez vos performances en un clin d'œil,
          suivez vos progrès et atteignez vos objectifs.
        </div>
      </section>
    </main>
  );
}