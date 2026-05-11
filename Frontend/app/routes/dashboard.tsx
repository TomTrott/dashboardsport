import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getUserInfo } from "../services/api";

export default function Dashboard() {
  // récupère token + fonction logout du Context
  const { token, logout } = useAuth();

  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const data = await getUserInfo(token);
        setUser(data);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

   // fonction déconnexion
  function handleLogout() {
    logout(); // supprime token localStorage
    navigate("/login"); // redirection login
  }

  // on attend de recevoir le token
  if (!token) return <p>Chargement session...</p>;

  // attend API
  if (loading) return <p>Chargement dashboard...</p>;

  // sécurité
  if (!user || !user.profile) return <p>Aucune donnée</p>;

  return (
    <main>
       <button onClick={handleLogout}>
        Déconnexion
      </button>
      <h1>Bonjour {user.profile.firstName}</h1>

      <p>Nom : {user.profile.lastName}</p>
      <p>Distance : {user.statistics.totalDistance} km</p>
    </main>
  );
}