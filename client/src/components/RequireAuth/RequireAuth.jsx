import { useLocation, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Use default import
import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect } from "react";

const RequireAuth = () => {
  const { auth } = useAuth();
  const refreshAccessToken = useRefreshToken();
  const location = useLocation();

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (auth?.accessToken && isTokenExpired(auth.accessToken)) {
        const success = await refreshAccessToken();
        if (!success) {
          // If refreshing failed, redirect to login
          <Navigate to="/login" state={{ from: location }} replace />;
        }
      }
    };

    checkAndRefreshToken();
  }, [auth, refreshAccessToken, location]);

  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
  import.meta.env.DEV && console.log("Decoded AT: ", decoded);

  return decoded?.UserInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
