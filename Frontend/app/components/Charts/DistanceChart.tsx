import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import "../../css/charts/DistanceChart.css";

interface DistanceData {
  week: string;
  distance: number;
}

interface DistanceChartProps {
  data: DistanceData[];
  currentDistanceWeek: number;
  setCurrentDistanceWeek: (value: number) => void;
  groupedActivitiesLength: number;
  formattedDistancePeriod: string;
}

export default function DistanceChart({
  data,
  currentDistanceWeek,
  setCurrentDistanceWeek,
  groupedActivitiesLength,
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
          <p>Total des kilomètres 4 dernières semaines</p>
        </div>
        <div className="dashboard-period">
          <button onClick={() => setCurrentDistanceWeek((prev) => (prev > 0 ? prev - 1 : prev))}>{"<"}</button>
          <span>{formattedDistancePeriod}</span>
          <button onClick={() => setCurrentDistanceWeek((prev) => (prev < groupedActivitiesLength - 4 ? prev + 1 : prev))}>{">"}</button>
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