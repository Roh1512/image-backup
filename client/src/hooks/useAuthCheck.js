import { useEffect, useState } from "react";

// Hook to check if the user is authenticated
const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/privateroute", {
          method: "GET",
          credentials: "include", // Sends cookies with the request
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setLoading(false);
      } finally {
        setLoading(false); // Finish loading after request is done
      }
    };

    checkAuth();
  }, []); // Run once on component mount

  return { isAuthenticated, loading };
};

export default useAuthCheck;
