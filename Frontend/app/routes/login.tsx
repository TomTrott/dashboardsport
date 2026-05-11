import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e:any) {
    e.preventDefault();

    const data = await loginUser(username, password);

    login(data.token);

    navigate("/dashboard");
  }

  return (
    <main>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Se connecter</button>
      </form>
    </main>
  );
}