import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import "../../css/charts/HeartRateChart.css";
interface HeartRateData {
  day: string;
  min: number;
  max: number;
  average: number;
  fullDate: string;
}

interface HeartRateChartProps {
  data: HeartRateData[];
  currentWeek: number;
  setCurrentWeek: (value: number) => void;
  groupedActivitiesLength: number;
  formattedPeriod: string;
}

export default function HeartRateChart({
  data,
  currentWeek,
  setCurrentWeek,
  groupedActivitiesLength,
  formattedPeriod,
}: HeartRateChartProps) {
  const averageHeartRate = data.length > 0
    ? Math.round(data.reduce((acc, item) => acc + item.average, 0) / data.length)
    : 0;

  return (
    <div className="dashboard-stat-card">
      <div className="dashboard-stat-top">
        <div className="dashboard-stat-title dashboard-stat-title-red">
          <h2>{averageHeartRate} BPM</h2>
          <p>Fréquence cardiaque moyenne</p>
        </div>
        <div className="dashboard-period">
          <button onClick={() => setCurrentWeek((prev) => (prev > 0 ? prev - 1 : prev))}>{"<"}</button>
          <span>{formattedPeriod}</span>
          <button onClick={() => setCurrentWeek((prev) => (prev < groupedActivitiesLength - 1 ? prev + 1 : prev))}>{">"}</button>
        </div>
      </div>
      <div className="dashboard-heart-chart">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#efefef" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#777", fontSize: 14 }}
            />
            <YAxis
              domain={[130, 187]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#777", fontSize: 13 }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="min" name="Min BPM" fill="#ffd2ca" radius={[10, 10, 0, 0]} barSize={14} />
            <Bar dataKey="max" name="Max BPM" fill="#ff3b13" radius={[10, 10, 0, 0]} barSize={14} />
            <Line
              type="monotone"
              dataKey="average"
              name="BPM Moyen"
              stroke="#2b46ff"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2b46ff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}