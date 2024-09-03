import PropTypes from "prop-types";
import styles from "./ErrorElement.module.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const ErrorElement = ({ error }) => {
  const navigate = useNavigate();
  import.meta.env.DEV && console.log(error);

  return (
    <div className={styles.errorDiv}>
      <h1>Something went wrong</h1>
      <p>
        <span>{error?.status}</span> {error?.statusText}
      </p>
      <Button onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
      <Button onClick={() => navigate("/login")}>Go to Login</Button>
    </div>
  );
};

ErrorElement.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    statusText: PropTypes.string,
  }),
};

export default ErrorElement;
