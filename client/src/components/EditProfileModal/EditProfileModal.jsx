import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Styles from "./EditProfileModal.module.css";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PropTypes from "prop-types";

const profileUrl = "/users/profile";

const EditProfileModal = ({ user, show, handleClose }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const submitChanges = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axiosPrivate.put(profileUrl, {
        username,
        email,
        currentPassword: password,
      });
      import.meta.env.DEV && console.log(response.data);
      setSuccess(
        response?.data.message || "User Details Updated Successfully."
      );
      setError(false);
      setPassword("");
    } catch (error) {
      setIsLoading(false);
      if (error.response.status === 401) {
        setError("Unauthorized");
      } else if (!error.response) {
        setError("No Server Response");
      } else {
        setError("Error Updating User Details.");
      }
      setSuccess(false);
      setPassword("");
      import.meta.env.DEV && console.error(error);
      throw new Error("Error Editing Profile Data. ", error);
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName={Styles.modal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Details</Modal.Title>
        </Modal.Header>
        {success && <p className={Styles.successMessage}>{success}</p>}
        {error && <p className={Styles.errorMessage}>{error}</p>}
        <Modal.Body>
          <form onSubmit={submitChanges}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                id="username"
                placeholder="Enter Username"
                value={username}
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                  setSuccess(null);
                  setError(null);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSuccess(null);
                  setError(null);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                id="password"
                placeholder="Enter Current Password to edit user details."
                value={password}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSuccess(null);
                  setError(null);
                }}
              />
              <Form.Text id="password" muted>
                Enter current password.
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

export default EditProfileModal;

EditProfileModal.propTypes = {
  user: PropTypes.object,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};
