import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getUserInfo, getUserActivity, } from "../services/api";
import "../css/Dashboard.css";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, } from "recharts";

export default function Dashboard() {
  /* déclaration des states */
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  /* semaine active */
  const [currentWeek, setCurrentWeek] = useState(0);

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
  /* données pour les graphiques */

  /* découpage des activités */
  const activitiesPerWeek = 7;

 /* tri des activités par date */
const sortedActivities = [...activities].sort(
  (a, b) =>
    new Date(a.date).getTime() -
    new Date(b.date).getTime()
);

/* découpage par semaine */
const groupedActivities = [];

for (
  let i = 0;
  i < sortedActivities.length;
  i += activitiesPerWeek
) {
  groupedActivities.push(
    sortedActivities.slice(
      i,
      i + activitiesPerWeek
    )
  );
}

  /* activités affichées */
  const currentActivities =
    groupedActivities[currentWeek] || [];

  /* données graphiques */
  const heartRateData = currentActivities.map(
    (activity: any) => ({
      day: new Date(activity.date)
        .toLocaleDateString("fr-FR", {
          weekday: "short",
        })
        .replace(".", ""),
      min: activity.heartRate.min,
      max: activity.heartRate.max,
      average: activity.heartRate.average,
      fullDate: activity.date,
    })
  );

  /* bpm moyen */
  const averageHeartRate =
    heartRateData.length > 0
      ? Math.round(
        heartRateData.reduce(
          (acc, item) =>
            acc + item.average,
          0
        ) / heartRateData.length
      )
      : 0;

  /* période affichée */
const firstDate = currentActivities[0]?.date;

const lastDate =
  currentActivities[
    currentActivities.length - 1
  ]?.date;

const formattedPeriod =
  firstDate && lastDate
    ? `Période du ${new Date(
        firstDate
      ).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })} au ${new Date(
        lastDate
      ).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })}`
    : "";

  return (

    <main className="dashboard-page">

      <Navbar />

      <section className="dashboard-content">

        {/* HEADER */}

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

        {/* TITLE */}

        <h1 className="dashboard-section-title">
          Vos dernières performances
        </h1>

        {/* STATS*/}

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
                  {averageHeartRate} BPM
                </h2>
                <p>
                  Fréquence cardiaque moyenne
                </p>
              </div>

              <div className="dashboard-period">
                <button
                  onClick={() =>
                    setCurrentWeek((prev) =>
                      prev > 0 ? prev - 1 : prev
                    )
                  }
                >
                  {"<"}
                </button>
                <span>
                  {formattedPeriod}
                </span>
                <button
                  onClick={() =>
                    setCurrentWeek((prev) =>
                      prev < groupedActivities.length - 1
                        ? prev + 1
                        : prev
                    )
                  }
                >
                  {">"}
                </button>
              </div>
            </div>

            <div className="dashboard-heart-chart">
              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <ComposedChart data={heartRateData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#efefef"
                  />

                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: "#777",
                      fontSize: 14,
                    }}
                  />

                  <YAxis
                    domain={[130, 187]}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: "#777",
                      fontSize: 13,
                    }}
                  />

                  <Tooltip />

                  <Legend />

                  {/* BPM MIN */}
                  <Bar
                    dataKey="min"
                    name="MinBPM"
                    fill="#ffd2ca"
                    radius={[10, 10, 0, 0]}
                    barSize={14}
                  />

                  {/* BPM MAX */}
                  <Bar
                    dataKey="max"
                    name="Max BPM"
                    fill="#ff3b13"
                    radius={[10, 10, 0, 0]}
                    barSize={14}
                  />

                  {/* BPM MOYEN */}
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="BPM Moyen"
                    stroke="#2b46ff"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#2b46ff",
                    }}
                  />

                </ComposedChart>
              </ResponsiveContainer>

            </div>

          </div>
        </div>

        {/* ACTIVITÉS*/}

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