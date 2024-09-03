import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Styles from "./EditPassword.module.css";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PropTypes from "prop-types";

const profileUrl = "/users/profile";

const EditPassword = ({ show, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const submitChanges = async (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.put(`${profileUrl}/pw`, {
          currentPassword,
          newPassword,
        });
        import.meta.env.DEV && console.log(response.data);
        setSuccess(response?.data.message || "Password changed successfully.");
        setError(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } catch (error) {
        setIsLoading(false);
        if (error.response.status === 401) {
          setError("Unauthorized");
        } else if (!error.response) {
          setError("No Server Response");
        } else {
          setError("Error changing password.");
        }
        setSuccess(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        import.meta.env.DEV && console.error(error);
        throw new Error("Error changing password ", error);
      } finally {
        setIsLoading(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } else {
      setError("Passwords do not match.");
      setSuccess(false);
      setIsLoading(false);
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        variant="dark"
        dialogClassName={Styles.modal}
        data-bs-theme="dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        {success && <p className={Styles.successMessage}>{success}</p>}
        {error && <p className={Styles.errorMessage}>{error}</p>}
        <Modal.Body>
          <form onSubmit={submitChanges}>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                id="currentPassword"
                placeholder="Enter Current Password."
                value={currentPassword}
                required
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setSuccess(false);
                  setError(false);
                }}
              />
              <Form.Text id="currentPassword" muted>
                Enter current password.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                id="newPassword"
                placeholder="Enter new password."
                value={newPassword}
                required
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setSuccess(false);
                  setError(false);
                }}
              />
              <Form.Text id="newPassword" muted>
                Enter new password.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                id="confirmNewPassword"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                required
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setSuccess(false);
                  setError(false);
                }}
              />
              <Form.Text id="confirmNewPassword" muted>
                Confirm new password.
              </Form.Text>
            </Form.Group>
            <Button
              type="submit"
              disabled={isLoading}
              style={{ textAlign: "center" }}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Updating...
                </>
              ) : (
                "Submit Details"
              )}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditPassword;

EditPassword.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};
