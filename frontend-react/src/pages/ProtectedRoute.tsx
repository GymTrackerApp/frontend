import { type JSX } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const tokensAvailable =
    localStorage.getItem("accessToken") != null ||
    localStorage.getItem("refreshToken") != null;

  return tokensAvailable ? children : <Navigate to="/register-login" replace />;
};

export default ProtectedRoute;
