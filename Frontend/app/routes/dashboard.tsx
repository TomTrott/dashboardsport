import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getUserInfo,
  getUserActivity,
} from "../services/api";
import "../css/Dashboard.css";

export default function Dashboard() {
  /* déclaration des states */
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        // utilisateur
        const userData = await getUserInfo(token);
        setUser(userData);
        // activités
        const activityData =
          await getUserActivity(
            token,
            "2025-01-01",
            "2025-12-31"
          );

        setActivities(activityData);
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  // loading
  if (!token) {
    return (
      <div className="dashboard-loading">
        Chargement session...
      </div>
    );
  }
  if (loading) {
    return (
      <div className="dashboard-loading">
        Chargement dashboard...
      </div>
    );
  }
  if (!user || !user.profile) {
    return (
      <div className="dashboard-empty">
        Aucune donnée
      </div>
    );
  }

  return (

    <main className="dashboard-page">

      <Navbar />

      <section className="dashboard-content">

        {/* =========================
            HEADER
        ========================= */}

        <div className="dashboard-header-card">

          {/* gauche */}
          <div className="dashboard-user-section">
            <img
              className="dashboard-user-image"
              src={user.profile.profilePicture}
              alt="profile"
            />

            <div className="dashboard-user-info">
              <h2>
                {user.profile.firstName}{" "}
                {user.profile.lastName}
              </h2>
              <p>
                Membre depuis le{" "}
                {new Date(user.profile.createdAt).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          {/* droite */}
          <div className="dashboard-distance-wrapper">
            <span>
              Distance totale parcourue
            </span>
            <div className="dashboard-distance-card">
              <h3>
                {user.statistics.totalDistance} km
              </h3>
            </div>
          </div>
        </div>

        {/* =========================
            TITLE
        ========================= */}

        <h1 className="dashboard-section-title">
          Vos dernières performances
        </h1>

        {/* =========================
            STATS
        ========================= */}

        <div className="dashboard-stats-grid">

          {/* CARD 1 */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-top">
              <div className="dashboard-stat-title dashboard-stat-title-blue">
                <h2>
                  18km en moyenne
                </h2>
                <p>
                  Total des kilomètres 4 dernières semaines
                </p>
              </div>

              <div className="dashboard-period">
                <button>{"<"}</button>
                <span>
                  28 mai - 25 juin
                </span>
                <button>{">"}</button>
              </div>
            </div>

            {/* chart fake */}
            <div className="dashboard-chart-placeholder" />
          </div>

          {/* CARD 2 */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-top">
              <div className="dashboard-stat-title dashboard-stat-title-red">
                <h2>
                  163 BPM
                </h2>
                <p>
                  Fréquence cardiaque moyenne
                </p>
              </div>

              <div className="dashboard-period">
                <button>{"<"}</button>
                <span>
                  28 mai - 04 juin
                </span>
                <button>{">"}</button>
              </div>

            </div>
            {/* chart fake */}
            <div className="dashboard-chart-placeholder" />
          </div>
        </div>

        {/* =========================
            ACTIVITÉS
        ========================= */}

        <section className="dashboard-activities">
          <h1 className="dashboard-section-title">
            Activités
          </h1>

          {activities.map((activity: any) => (

            <div
              key={activity.date}
              className="dashboard-activity-card"
            >

              <h3>
                {activity.date}
              </h3>

              <div className="dashboard-activity-list">
                <div className="dashboard-activity-item">
                  <span>Distance</span>
                  <strong>
                    {activity.distance} km
                  </strong>
                </div>

                <div className="dashboard-activity-item">
                  <span>Durée</span>
                  <strong>
                    {activity.duration} min
                  </strong>
                </div>

                <div className="dashboard-activity-item">
                  <span>Calories</span>

                  <strong>
                    {activity.caloriesBurned}
                  </strong>
                </div>

                <div className="dashboard-activity-item">
                  <span>BPM min</span>
                  <strong>
                    {activity.heartRate.min}
                  </strong>
                </div>

                <div className="dashboard-activity-item">
                  <span>BPM max</span>
                  <strong>
                    {activity.heartRate.max}
                  </strong>
                </div>

                <div className="dashboard-activity-item">
                  <span>BPM moyen</span>
                  <strong>
                    {activity.heartRate.average}
                  </strong>
                </div>
              </div>
            </div>

          ))}
        </section>
      </section>
      <Footer />
    </main>
  );
}