import { createContext, useState } from "react";
import PropTypes from "prop-types";

const RefreshContext = createContext(0);

export const RefreshContextProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(0);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

RefreshContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RefreshContext;
