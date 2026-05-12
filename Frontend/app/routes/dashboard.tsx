import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { getUserInfo, getUserActivity } from "../services/api";
import "../css/Dashboard.css";
import { HeartRateChart, DistanceChart, WeeklySummary } from "../components/Charts";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const userData = await getUserInfo(token);
        setUser(userData);
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

  if (!token) {
    return <div className="dashboard-loading">Chargement session...</div>;
  }
  if (loading) {
    return <div className="dashboard-loading">Chargement dashboard...</div>;
  }
  if (!user || !user.profile) {
    return <div className="dashboard-empty">Aucune donnée</div>;
  }

  // Tri des activités par date
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Fonction pour regrouper les activités par semaine (lundi-dimanche)
  const groupActivitiesByWeek = (activities: any[]) => {
    const weeks: any[] = [];
    let currentWeek: any[] = [];

    activities.forEach((activity) => {
      const date = new Date(activity.date);
      const dayOfWeek = date.getDay(); // 0 (dimanche) à 6 (samedi)
      const monday = new Date(date);
      monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

      if (currentWeek.length === 0) {
        currentWeek.push(activity);
      } else {
        const lastActivityDate = new Date(currentWeek[currentWeek.length - 1].date);
        const lastMonday = new Date(lastActivityDate);
        lastMonday.setDate(lastActivityDate.getDate() - (lastActivityDate.getDay() === 0 ? 6 : lastActivityDate.getDay() - 1));

        if (monday.getTime() === lastMonday.getTime()) {
          currentWeek.push(activity);
        } else {
          weeks.push(currentWeek);
          currentWeek = [activity];
        }
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Fonction pour regrouper les semaines par mois
  const groupWeeksByMonth = (weeks: any[]) => {
    const months: { month: string; weeks: any[] }[] = [];
    let currentMonth = "";

    weeks.forEach((week) => {
      const firstDayOfWeek = new Date(week[0].date);
      const monthYear = firstDayOfWeek.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

      if (currentMonth !== monthYear) {
        currentMonth = monthYear;
        months.push({ month: monthYear, weeks: [week] });
      } else {
        months[months.length - 1].weeks.push(week);
      }
    });

    return months;
  };

  const groupedActivitiesByWeek = groupActivitiesByWeek(sortedActivities);
  const months = groupWeeksByMonth(groupedActivitiesByWeek);
  const currentMonth = months[currentMonthIndex];
  const currentMonthWeeks = currentMonth?.weeks || [];

  // Données pour le graphique BPM (semaine active)
  const currentWeekActivities = groupedActivitiesByWeek[currentWeekIndex] || [];
  const heartRateData = currentWeekActivities.map((activity: any) => ({
    day: new Date(activity.date).toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
    min: activity.heartRate.min,
    max: activity.heartRate.max,
    average: activity.heartRate.average,
    fullDate: activity.date,
  }));

  // Période affichée pour le graphique BPM
  const firstDate = currentWeekActivities[0]?.date;
  const lastDate = currentWeekActivities[currentWeekActivities.length - 1]?.date;
  const formattedPeriod = firstDate && lastDate
    ? `Période du ${new Date(firstDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au ${new Date(lastDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
    : "";

  // Données pour le graphique Distance (toutes les semaines du mois actuel)
  const distanceData = currentMonthWeeks.map((week: any, index: number) => {
    const totalDistance = week.reduce((acc: number, activity: any) => acc + activity.distance, 0);
    const firstDayOfWeek = week[0]?.date ? new Date(week[0].date) : new Date();
    return {
      week: `S${index + 1}`,
      distance: Number(totalDistance.toFixed(1)),
      startDate: firstDayOfWeek,
    };
  });

  // Période affichée pour le graphique Distance
  const formattedDistancePeriod = currentMonth ? currentMonth.month : "";

  // Calcul des données pour "Cette semaine" (semaine active)
  const completedRuns = currentWeekActivities.length;
  const totalDuration = currentWeekActivities.reduce((acc: number, activity: any) => acc + activity.duration, 0);
  const totalDistanceWeekly = currentWeekActivities.reduce((acc: number, activity: any) => acc + activity.distance, 0);
  const weeklyGoal = 6;
  const currentWeekStartDate = currentWeekActivities[0]?.date || "";
  const currentWeekEndDate = currentWeekActivities[currentWeekActivities.length - 1]?.date || "";

  return (
    <main className="dashboard-page">
      <Navbar />
      <section className="dashboard-content">
        {/* HEADER */}
        <div className="dashboard-header-card">
          <div className="dashboard-user-section">
            <img className="dashboard-user-image" src={user.profile.profilePicture} alt="profile" />
            <div className="dashboard-user-info">
              <h2>{user.profile.firstName} {user.profile.lastName}</h2>
              <p>Membre depuis le {new Date(user.profile.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
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
          {/* Km moyens */}
          <DistanceChart
            data={distanceData}
            currentMonthIndex={currentMonthIndex}
            setCurrentMonthIndex={setCurrentMonthIndex}
            monthsLength={months.length}
            formattedDistancePeriod={formattedDistancePeriod}
          />
          {/* bpm */}
          <HeartRateChart
            data={heartRateData}
            currentWeekIndex={currentWeekIndex}
            setCurrentWeekIndex={setCurrentWeekIndex}
            groupedActivitiesLength={groupedActivitiesByWeek.length}
            formattedPeriod={formattedPeriod}
          />
        </div>

        {/* CETTE SEMAINE */}
        <WeeklySummary
          weeklyGoal={weeklyGoal}
          completedRuns={completedRuns}
          totalDuration={totalDuration}
          totalDistance={totalDistanceWeekly.toFixed(1)}
          startDate={currentWeekStartDate}
          endDate={currentWeekEndDate}
        />
      </section>
      <Footer />
    </main>
  );
}