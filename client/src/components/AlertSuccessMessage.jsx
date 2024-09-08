import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
import { useTheme } from "../context/themeContext/ThemeContext";

const AlertSuccessMessage = ({ message }) => {
  const { theme } = useTheme();
  return (
    <Alert
      variant="success"
      data-bs-theme={theme === "dark" ? "dark" : "light"}
      dismissible
      className="AlertErrorMessage"
    >
      <p>{message}</p>
    </Alert>
  );
};

AlertSuccessMessage.propTypes = {
  message: PropTypes.string,
};

export default AlertSuccessMessage;
