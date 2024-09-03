import { useContext } from "react";
import refreshContext from "../context/RefreshContext";
const useRefreshContext = () => {
  return useContext(refreshContext);
};

export default useRefreshContext;
