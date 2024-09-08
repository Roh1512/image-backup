import { useContext } from "react";
import refreshContext from "../context/RefreshContent";

const useRefreshContext = () => {
  return useContext(refreshContext);
};
export default useRefreshContext;
