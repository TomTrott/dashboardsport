import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}