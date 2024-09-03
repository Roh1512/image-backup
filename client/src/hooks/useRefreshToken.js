import axios from "../api/axios";
import useAuth from "./useAuth";
const refreshPath = "/auth/refresh";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios(refreshPath, {
        withCredentials: true,
      });
      console.log("Refresh response: ", response);

      import.meta.env.DEV && console.log("Refresh response: ", response);

      setAuth((prev) => {
        import.meta.env.DEV && console.log("AT Before: ", JSON.stringify(prev));
        import.meta.env.DEV &&
          console.log("AT After: ", response.data.accessToken);
        return {
          ...prev,
          accessToken: response.data.accessToken,
        };
      });
      return response.data.accessToken;
    } catch (error) {
      import.meta.env.DEV &&
        console.error("Failed to fetch refresh token", error);
      throw new Error(error); // Re-throw the error to handle it in the calling function
    }
  };

  return refresh;
};

export default useRefreshToken;
