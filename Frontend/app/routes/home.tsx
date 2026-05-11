import { useEffect, useState } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Sport" },
    { name: "description", content: "Dashboard utilisateur" },
  ];
}

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        // LOGIN
        const loginRes = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "sophiemartin",
            password: "password123",
          }),
        });

        const loginData = await loginRes.json();

        // GET USER INFO
        const userRes = await fetch("http://localhost:8000/api/user-info", {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
          },
        });

        const userData = await userRes.json();

        setUser(userData);
      } catch (error) {
        console.error("Erreur API :", error);
      }
    }

    fetchUser();
  }, []);

  if (!user || !user.profile) {
    return <p>Chargement...</p>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Bonjour {user.profile.firstName}</h1>

      <img
        src={user.profile.profilePicture}
        alt="profil"
        width="150"
        style={{ borderRadius: "50%" }}
      />

      <p>Nom : {user.profile.lastName}</p>
      <p>Age : {user.profile.age} ans</p>
      <p>Taille : {user.profile.height} cm</p>
      <p>Poids : {user.profile.weight} kg</p>

      <hr />

      <h2>Statistiques</h2>

      <p>Distance totale : {user.statistics.totalDistance} km</p>
      <p>Sessions : {user.statistics.totalSessions}</p>
      <p>Durée totale : {user.statistics.totalDuration} min</p>
    </main>
  );
}