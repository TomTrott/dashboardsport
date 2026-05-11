import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserInfo } from "../services/api";

export default function Dashboard() {
  const { token } = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getUserInfo(token);
      setUser(data);
    }

    load();
  }, []);

  if (!user) return <p>Chargement</p>;

  return (
    <main>
      <h1>Bonjour {user.profile.firstName}</h1>
      <p>Distance : {user.statistics.totalDistance} km</p>
    </main>
  );
}