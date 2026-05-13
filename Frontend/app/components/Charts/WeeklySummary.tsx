import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../../css/charts/WeeklySummary.css";

interface WeeklySummaryProps {
  weeklyGoal: number;
  completedRuns: number;
  totalDuration: number;
  totalDistance: string;
  startDate: string;
  endDate: string;
}

const COLORS = ["#2340ff", "#C7D2FE"];

export default function WeeklySummary({
  weeklyGoal,
  completedRuns,
  totalDuration,
  totalDistance,
  startDate,
  endDate,
}: WeeklySummaryProps) {
  const data = [
    { name: "Réalisées", value: completedRuns },
    { name: "Restantes", value: weeklyGoal - completedRuns },
  ];

  const formattedStartDate = new Date(startDate).toLocaleDateString("fr-FR");
  const formattedEndDate = new Date(endDate).toLocaleDateString("fr-FR");

  return (
    <section className="weekly-summary">
      <div className="weekly-summary-header">
        <h2>Cette semaine</h2>

        <p>
          Du {formattedStartDate} au {formattedEndDate}
        </p>
      </div>

      <div className="weekly-summary-content">
        {/* Bloc gauche */}
        <div className="weekly-summary-chart">
          <div className="weekly-summary-goal">
            <span className="weekly-summary-goal-text">
              x{completedRuns}{" "}
              <span>sur objectif de {weeklyGoal}</span>
            </span>

            <p>Courses hebdomadaires réalisées</p>
          </div>

          {/* Graphique + légendes */}
          <div className="weekly-summary-pie-wrapper">
            {/* Légende gauche */}
            <div className="weekly-summary-legend weekly-summary-legend-left">
              <span className="weekly-summary-legend-dot weekly-summary-legend-dot-light" />

              <span>{weeklyGoal - completedRuns} restants</span>

            </div>

            {/* Camembert */}
            <div className="weekly-summary-pie-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Légende droite */}
            <div className="weekly-summary-legend weekly-summary-legend-right">
              <span className="weekly-summary-legend-dot weekly-summary-legend-dot-dark" />
              <span>{completedRuns} réalisées</span>
            </div>
          </div>
        </div>

        {/* Bloc droite */}
        <div className="weekly-summary-stats">
          {/* Carte durée */}
          <div className="weekly-summary-stat">
            <span className="weekly-summary-stat-title">
              Durée d'activité
            </span>

            <div className="weekly-summary-stat-data">
              <strong className="weekly-summary-stat-value weekly-summary-stat-value-dark-blue">
                {totalDuration}
              </strong>

              <span className="weekly-summary-stat-unit weekly-summary-stat-unit-blue">
                minutes
              </span>
            </div>
          </div>

          {/* Carte distance */}
          <div className="weekly-summary-stat">
            <span className="weekly-summary-stat-title">
              Distance
            </span>

            <div className="weekly-summary-stat-data">
              <strong className="weekly-summary-stat-value weekly-summary-stat-value-dark-red">
                {totalDistance}
              </strong>

              <span className="weekly-summary-stat-unit weekly-summary-stat-unit-red">
                kilomètres
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}