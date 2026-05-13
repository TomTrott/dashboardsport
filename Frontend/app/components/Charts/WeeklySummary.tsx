import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "../../css/charts/WeeklySummary.css";

interface WeeklySummaryProps {
  weeklyGoal: number;
  completedRuns: number;
  totalDuration: number;
  totalDistance: string;
  startDate: string;
  endDate: string;
}

const COLORS = ["#2340ff", "#C7D2FE"]; // Bleu foncé et bleu clair pour le camembert

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
        <div className="weekly-summary-chart">
          <div className="weekly-summary-goal">
            <span className="weekly-summary-goal-text">
  x{completedRuns} <span>sur objectif de {weeklyGoal}</span>
</span>
            <p>Courses hebdomadaires réalisées</p>
          </div>
          <div className="weekly-summary-pie-chart">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="weekly-summary-stats">
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