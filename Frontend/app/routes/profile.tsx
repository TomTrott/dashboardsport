import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getUserInfo } from "../services/api";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import "../css/Profil.css";

export default function Profile() {
  const { token } = useAuth();
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
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, navigate]);

  if (!token) return <p>Chargement session...</p>;
  if (loading) return <p>Chargement profil...</p>;
  if (!user || !user.profile) return <p>Aucune donnée</p>;

  const totalCaloriesBurned = user.runningData.reduce(
    (sum: number, session: any) => sum + session.caloriesBurned,
    0
  );

  const firstDate = new Date(user.runningData[0].date);
  const lastDate = new Date(
    user.runningData[user.runningData.length - 1].date
  );

  const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());

  const totalDays =
    Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const totalRestDays =
    totalDays - user.runningData.length;

  const formattedDate = new Date(
    user.profile.createdAt
  ).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const genderLabel =
    user.profile.gender === "male"
      ? "Homme"
      : user.profile.gender === "female"
      ? "Femme"
      : user.profile.gender;

  const totalMinutes = Number(user.statistics.totalDuration);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-content">
        {/* GAUCHE */}
        <section className="profile-left">

          <div className="profile-user-card">
            <img
              src={user.profile.profilePicture}
              alt="Profil"
            />

            <div className="profile-user-info">
              <h2>
                {user.profile.firstName}{" "}
                {user.profile.lastName}
              </h2>

              <p>
                Membre depuis le{" "}
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="profile-info-card">
            <h2>Votre profil</h2>

            <div className="profile-divider"></div>

            <div className="profile-info-list">
              <p>Âge : {user.profile.age}</p>

              <p>Genre : {genderLabel}</p>

              <p>
                Taille : {user.profile.height}
              </p>

              <p>
                Poids : {user.profile.weight}
              </p>
            </div>
          </div>

        </section>

        {/* DROITE */}
        <section className="profile-right">

          <h1>Vos statistiques</h1>

          <span>
            depuis le {formattedDate}
          </span>

          <div className="stats-grid">

            <div className="stat-card">
              <p>Temps total couru</p>
              <h2>
                {hours}h {minutes}min
              </h2>
            </div>

            <div className="stat-card">
              <p>Calories brûlées</p>
              <h2>
                {totalCaloriesBurned}
                <span> cal</span>
              </h2>
            </div>

            <div className="stat-card">
              <p>Distance totale parcourue</p>
              <h2>
                {user.statistics.totalDistance}
                <span> km</span>
              </h2>
            </div>

            <div className="stat-card">
              <p>Nombre de jours de repos</p>
              <h2>
                {totalRestDays}
                <span> jours</span>
              </h2>
            </div>

            <div className="stat-card">
              <p>Nombre de sessions</p>
              <h2>
                {user.statistics.totalSessions}
                <span> sessions</span>
              </h2>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}