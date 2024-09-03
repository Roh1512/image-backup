import axios from "../api/axios";
import useAuth from "./useAuth";
const logoutUrl = "/auth/logout";

const useLogout = () => {
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    try {
      const response = await axios(logoutUrl, { withCredentials: true });
      import.meta.env.DEV && console.log(response);
    } catch (error) {
      import.meta.env.DEV && console.error("Logout Error: ", error);
      throw new Error(error);
    } finally {
      setAuth(null);
      console.log("Auth token", auth);
    }
  };
  return logout;
};

export default useLogout;
