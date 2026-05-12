import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { getUserInfo, getUserActivity } from "../services/api";
import "../css/Dashboard.css";
import { HeartRateChart, DistanceChart } from "../components/Charts";

export default function Dashboard() {
  /* déclaration des states */
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  /* semaine active BPM */
  const [currentWeek, setCurrentWeek] = useState(0);
  /* semaine active KM */
  const [currentDistanceWeek, setCurrentDistanceWeek] = useState(0);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        // utilisateur
        const userData = await getUserInfo(token);
        setUser(userData);
        // activités
        const activityData = await getUserActivity(token, "2025-01-01", "2025-12-31");
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
    return <div className="dashboard-loading">Chargement session...</div>;
  }
  if (loading) {
    return <div className="dashboard-loading">Chargement dashboard...</div>;
  }
  if (!user || !user.profile) {
    return <div className="dashboard-empty">Aucune donnée</div>;
  }

  /* données pour les graphiques */
  /* découpage des activités */
  const activitiesPerWeek = 7;
  /* tri des activités par date */
  const sortedActivities = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  /* découpage par semaine */
  const groupedActivities = [];
  for (let i = 0; i < sortedActivities.length; i += activitiesPerWeek) {
    groupedActivities.push(sortedActivities.slice(i, i + activitiesPerWeek));
  }

  /* activités affichées */
  const currentActivities = groupedActivities[currentWeek] || [];
  /* données graphiques BPM */
  const heartRateData = currentActivities.map((activity: any) => ({
    day: new Date(activity.date).toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
    min: activity.heartRate.min,
    max: activity.heartRate.max,
    average: activity.heartRate.average,
    fullDate: activity.date,
  }));
  /* période affichée BPM */
  const firstDate = currentActivities[0]?.date;
  const lastDate = currentActivities[currentActivities.length - 1]?.date;
  const formattedPeriod = firstDate && lastDate
    ? `Période du ${new Date(firstDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au ${new Date(lastDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
    : "";

  /* données kilométriques des 4 semaines */
  const distanceData = groupedActivities.slice(currentDistanceWeek, currentDistanceWeek + 4).map((week: any, index: number) => {
    const totalDistance = week.reduce((acc: number, activity: any) => acc + activity.distance, 0);
    return { week: `S${index + 1}`, distance: Number(totalDistance.toFixed(1)) };
  });
  /* période graphique kilomètres */
  const distanceFirstDate = groupedActivities[currentDistanceWeek]?.[0]?.date;
  const distanceLastDate = groupedActivities[Math.min(currentDistanceWeek + 3, groupedActivities.length - 1)]?.slice(-1)[0]?.date;
  const formattedDistancePeriod = distanceFirstDate && distanceLastDate
    ? `${new Date(distanceFirstDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${new Date(distanceLastDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`
    : "";

  return (
    <main className="dashboard-page">
      <Navbar />
      <section className="dashboard-content">
        {/* HEADER */}
        <div className="dashboard-header-card">
          {/* gauche */}
          <div className="dashboard-user-section">
            <img className="dashboard-user-image" src={user.profile.profilePicture} alt="profile" />
            <div className="dashboard-user-info">
              <h2>{user.profile.firstName} {user.profile.lastName}</h2>
              <p>Membre depuis le {new Date(user.profile.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
          {/* droite */}
          <div className="dashboard-distance-wrapper">
            <span>Distance totale parcourue</span>
            <div className="dashboard-distance-card">
              <h3>{user.statistics.totalDistance} km</h3>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="dashboard-section-title">Vos dernières performances</h1>

        {/* STATS */}
        <div className="dashboard-stats-grid">
          <DistanceChart
            data={distanceData}
            currentDistanceWeek={currentDistanceWeek}
            setCurrentDistanceWeek={setCurrentDistanceWeek}
            groupedActivitiesLength={groupedActivities.length}
            formattedDistancePeriod={formattedDistancePeriod}
          />
          <HeartRateChart
            data={heartRateData}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
            groupedActivitiesLength={groupedActivities.length}
            formattedPeriod={formattedPeriod}
          />
        </div>

        {/* ACTIVITÉS */}
        <section className="dashboard-activities">
          <h1 className="dashboard-section-title">Activités</h1>
          {activities.map((activity: any) => (
            <div key={activity.date} className="dashboard-activity-card">
              <h3>{activity.date}</h3>
              <div className="dashboard-activity-list">
                <div className="dashboard-activity-item"><span>Distance</span><strong>{activity.distance} km</strong></div>
                <div className="dashboard-activity-item"><span>Durée</span><strong>{activity.duration} min</strong></div>
                <div className="dashboard-activity-item"><span>Calories</span><strong>{activity.caloriesBurned}</strong></div>
                <div className="dashboard-activity-item"><span>BPM min</span><strong>{activity.heartRate.min}</strong></div>
                <div className="dashboard-activity-item"><span>BPM max</span><strong>{activity.heartRate.max}</strong></div>
                <div className="dashboard-activity-item"><span>BPM moyen</span><strong>{activity.heartRate.average}</strong></div>
              </div>
            </div>
          ))}
        </section>
      </section>
      <Footer />
    </main>
  );
}