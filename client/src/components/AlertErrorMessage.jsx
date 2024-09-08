import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
import { useTheme } from "../context/themeContext/ThemeContext";

function AlertErrorMessage({ message }) {
  const { theme } = useTheme();
  return (
    <Alert
      variant="danger"
      data-bs-theme={theme === "dark" ? "dark" : "light"}
      dismissible
      className="AlertErrorMessage"
    >
      <p>{message}</p>
    </Alert>
  );
}
AlertErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default AlertErrorMessage;
