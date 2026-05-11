import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

import { getUserInfo } from "../services/api";

export default function Profile() {
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

  function handleLogout() {
    logout();

    navigate("/login");
  }

  if (!token) {
    return <p>Chargement session...</p>;
  }

  if (loading) {
    return <p>Chargement profil...</p>;
  }

  if (!user || !user.profile) {
    return <p>Aucune donnée</p>;
  }

  return (
    <main>
      <button onClick={handleLogout}>
        Déconnexion
      </button>

      <button
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>

      <h1>Mon profil</h1>

      <hr />

      <img
        src={`http://localhost:8000/images/${user.profile.profilePicture}`}
        alt="profile"
        width="150"
      />

      <h2>
        {user.profile.firstName}
        {" "}
        {user.profile.lastName}
      </h2>

      <p>
        Membre depuis :
        {" "}
        {user.profile.createdAt}
      </p>

      <hr />

      <h2>Informations</h2>

      <p>
        Âge :
        {" "}
        {user.profile.age}
      </p>

      <p>
        Taille :
        {" "}
        {user.profile.height}
      </p>

      <p>
        Poids :
        {" "}
        {user.profile.weight}
      </p>

      <hr />

      <h2>Statistiques</h2>

      <p>
        Distance totale :
        {" "}
        {user.statistics.totalDistance}
        {" "}km
      </p>

      <p>
        Nombre de sessions :
        {" "}
        {user.statistics.totalSessions}
      </p>

      <p>
        Temps total :
        {" "}
        {user.statistics.totalDuration}
        {" "}minutes
      </p>
    </main>
  );
}