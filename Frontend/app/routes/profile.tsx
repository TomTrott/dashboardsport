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

  }, [token, navigate]);

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

  // Calcul calories brûlées
  //additions des caloris bruler de  chaque session

  const totalCaloriesBurned = user.runningData.reduce(
    (sum: number, session: any) =>
      sum + session.caloriesBurned,
    0
  );

  // Calcul jours de repos
// récupère le premier et le dernier jour de session pour calculer le nombre total de jours entre les deux
//puis soustrait le nombre de sessions pour obtenir le nombre de jours de repos
  const firstDate = new Date(
    user.runningData[0].date
  );

  const lastDate = new Date(
    user.runningData[user.runningData.length - 1].date
  );

  const diffTime = Math.abs(
    lastDate.getTime() - firstDate.getTime()
  );

  const totalDays =
    Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const totalRestDays =
    totalDays - user.runningData.length;

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
        src={user.profile.profilePicture}
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
        {user.profile.height} cm
      </p>

      <p>
        Poids :
        {" "}
        {user.profile.weight} kg
      </p>

      <hr />

      <h2>Statistiques</h2>

      <p>
        Distance totale :
        {" "}
        {user.statistics.totalDistance} km
      </p>

      <p>
        Nombre de sessions :
        {" "}
        {user.statistics.totalSessions}
      </p>

      <p>
        Temps total :
        {" "}
        {user.statistics.totalDuration} minutes
      </p>

      <p>
        Calories brûlées :
        {" "}
        {totalCaloriesBurned} kcal
      </p>

      <p>
        Nombre de jours de repos :
        {" "}
        {totalRestDays}
      </p>

    </main>
  );
}