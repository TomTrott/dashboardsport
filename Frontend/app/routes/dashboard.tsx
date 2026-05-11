import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  getUserInfo,
  getUserActivity,
} from "../services/api";

export default function Dashboard() {
  const { token, logout } = useAuth();

  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  const [activities, setActivities] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        // infos utilisateur
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

  function handleLogout() {
    logout();

    navigate("/");
  }

  if (!token) {
    return <p>Chargement session...</p>;
  }

  if (loading) {
    return <p>Chargement dashboard...</p>;
  }

  if (!user || !user.profile) {
    return <p>Aucune donnée</p>;
  }

  return (
    <main>
      <Navbar />
      <hr />
      <h2>
        Bonjour {user.profile.firstName}
      </h2>

      <p>
        Nom : {user.profile.lastName}
      </p>

      <p>
        Distance totale :
        {" "}
        {user.statistics.totalDistance}
        {" "}km
      </p>

      <hr />

      <h2>Activités</h2>

      {activities.map((activity: any) => (
        <div
          key={activity.date}
          style={{
            marginBottom: "20px",
          }}
        >
          <h3>{activity.date}</h3>

          <p>
            Distance :
            {" "}
            {activity.distance}
            {" "}km
          </p>

          <p>
            Durée :
            {" "}
            {activity.duration}
            {" "}minutes
          </p>

          <p>
            Calories :
            {" "}
            {activity.caloriesBurned}
          </p>

          <p>
            BPM minimum :
            {" "}
            {activity.heartRate.min}
          </p>

          <p>
            BPM maximum :
            {" "}
            {activity.heartRate.max}
          </p>

          <p>
            BPM moyen :
            {" "}
            {activity.heartRate.average}
          </p>

          <hr />
        </div>
      ))}
    </main>
  );
}