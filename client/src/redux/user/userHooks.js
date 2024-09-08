import { useSelector } from "react-redux";

// Hook to select the current user
export const useCurrentUser = () => {
  return useSelector((state) => state.user.currentUser);
};

// Hook to select the loading state
export const useLoading = () => {
  return useSelector((state) => state.user.loading);
};

// Hook to select the error state
export const useError = () => {
  return useSelector((state) => state.user.error);
};
