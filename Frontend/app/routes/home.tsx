import { Link } from "react-router";

export default function Home() {
  return (
    <main>
      <h1>Accueil</h1>
      <Link to="/login">Connexion</Link>
    </main>
  );
}