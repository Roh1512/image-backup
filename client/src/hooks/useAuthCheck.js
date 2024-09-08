import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Hook to check if the user is authenticated
const useAuthCheck = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/privateroute", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          setIsAuthenticated(false);
          navigate("/home"); // Ensure this is the correct route
        } else if (response.ok) {
          setIsAuthenticated(true);
        } else {
          console.error("Unexpected response status:", response.status);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { isAuthenticated, loading };
};

export default useAuthCheck;
