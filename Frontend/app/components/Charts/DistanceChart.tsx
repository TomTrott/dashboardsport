import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import "../../css/charts/DistanceChart.css";

interface DistanceData {
  week: string;
  distance: number;
}

interface DistanceChartProps {
  data: DistanceData[];
  currentMonthIndex: number;
  setCurrentMonthIndex: (value: number) => void;
  monthsLength: number;
  formattedDistancePeriod: string;
}

export default function DistanceChart({
  data,
  currentMonthIndex,
  setCurrentMonthIndex,
  monthsLength,
  formattedDistancePeriod,
}: DistanceChartProps) {
  const averageDistance = data.length > 0
    ? Math.round(data.reduce((acc, item) => acc + item.distance, 0) / data.length)
    : 0;

  return (
    <div className="dashboard-stat-card">
      <div className="dashboard-stat-top">
        <div className="dashboard-stat-title dashboard-stat-title-blue">
          <h2>{averageDistance}km en moyenne</h2>
          <p>Total des kilomètres pour le mois</p>
        </div>
        <div className="dashboard-period">
          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : prev))}
            disabled={currentMonthIndex === 0}
          >
            {"<"}
          </button>
          <span>{formattedDistancePeriod}</span>
          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev < monthsLength - 1 ? prev + 1 : prev))}
            disabled={currentMonthIndex === monthsLength - 1}
          >
            {">"}
          </button>
        </div>
      </div>
      <div className="dashboard-km-chart">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#efefef" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#777", fontSize: 14 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#777", fontSize: 13 }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="distance" name="Km" fill="#aeb7ff" radius={[12, 12, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}