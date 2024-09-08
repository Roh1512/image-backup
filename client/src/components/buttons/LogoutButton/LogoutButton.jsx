import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/user/userSlice";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ setError }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch("api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        dispatch(logout());
        throw new Error("error logging out");
      }
      dispatch(logout());
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      dispatch(logout());
      setError(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button variant="secondary" disabled={loading} onClick={handleLogout}>
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="visually-hidden">Loading...</span>
        </>
      ) : (
        "Logout"
      )}
    </Button>
  );
};

LogoutButton.propTypes = {
  setError: PropTypes.func.isRequired,
};

export default LogoutButton;
