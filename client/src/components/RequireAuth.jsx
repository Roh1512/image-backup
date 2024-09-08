import { Outlet, Navigate } from "react-router-dom";
import { useCurrentUser } from "../redux/user/userHooks";
// import useAuthCheck from "../hooks/useAuthCheck";

// import LoadingAnimation from "./LoadingAnimation/LoadingAnimation";

const RequireAuth = () => {
  const currentUser = useCurrentUser();
  // const loading = useLoading();

  return currentUser ? <Outlet /> : <Navigate to="/home" />;
};

export default RequireAuth;
