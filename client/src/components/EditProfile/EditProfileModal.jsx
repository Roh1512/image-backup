import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Styles from "./EditProfileModal.module.css";
import { useDispatch } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import { FaUserEdit } from "react-icons/fa";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import { useLoading } from "../../redux/user/userHooks";
import { useError } from "../../redux/user/userHooks";

import { useTheme } from "../../context/themeContext/ThemeContext";
import { useCurrentUser } from "../../redux/user/userHooks";
import AlertErrorMessage from "../AlertErrorMessage";
import AlertSuccessMessage from "../AlertSuccessMessage";

const EditProfileModal = () => {
  const [show, setShow] = useState(false);
  const { theme } = useTheme();
  const currentUser = useCurrentUser();

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const isLoading = useLoading();
  const isError = useError();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setPassword("");
    setSuccess(false);
    setShow(false);
  };
  const handleShow = () => {
    setPassword("");
    setSuccess(false);
    setShow(true);
  };

  const handleUsernameChange = (e) => {
    setSuccess(false);
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setSuccess(false);
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setSuccess(false);
    setPassword(e.target.value);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccess(false);
      dispatch(updateUserStart());
      const response = await fetch("/api/profile/editprofile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();
      // console.log(result);
      if (!response.ok) {
        setSuccess(false);
        dispatch(updateUserFailure(result));
        return;
      }
      dispatch(updateUserSuccess(result));
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      console.error(error);
      dispatch(updateUserFailure(error));
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleShow}
        className="alignButtonContent"
      >
        <FaUserEdit />
        <span>Edit Profile</span>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="username">Username</InputGroup.Text>
              <Form.Control
                aria-label="username"
                aria-describedby="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                disabled={isLoading}
                required
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="email">Email ID</InputGroup.Text>
              <Form.Control
                aria-label="email"
                aria-describedby="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                required
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="password">Password</InputGroup.Text>
              <Form.Control
                aria-label="password"
                aria-describedby="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                required
              />
            </InputGroup>
            <div className={Styles.buttonDiv}>
              <Button
                variant="secondary"
                type="button"
                onClick={handleClose}
                disabled={isLoading}
              >
                Close
              </Button>
              <Button variant="success" disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Loading...
                  </>
                ) : (
                  "Submit Changes"
                )}
              </Button>
            </div>
          </Form>
          {isError && (
            <AlertErrorMessage
              message={isError.message || "Error updating profile"}
            />
          )}
          {success && (
            <AlertSuccessMessage message={"Profile updated successfully"} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfileModal;
