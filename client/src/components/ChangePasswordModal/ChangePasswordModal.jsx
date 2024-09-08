import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Styles from "./ChangePasswordModal.module.css";
import { useDispatch } from "react-redux";
import Spinner from "react-bootstrap/Spinner";

import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import { useLoading } from "../../redux/user/userHooks";
import { useError } from "../../redux/user/userHooks";

import { useTheme } from "../../context/themeContext/ThemeContext";
import AlertErrorMessage from "../AlertErrorMessage";
import AlertSuccessMessage from "../AlertSuccessMessage";
import { RiLockPasswordFill } from "react-icons/ri";

const ChangePasswordModal = () => {
  const [show, setShow] = useState(false);
  const { theme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const isLoading = useLoading();
  const isError = useError();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  const passwordMatch =
    newPassword && confirmNewPassword && newPassword === confirmNewPassword;

  const handleClose = () => {
    setSuccess(false);
    setShow(false);
    setCurrentPassword("");
    setNewPassword("");
    setCurrentPassword("");
  };
  const handleShow = () => {
    setSuccess(false);
    setShow(true);
    setCurrentPassword("");
    setNewPassword("");
    setCurrentPassword("");
  };

  const handleCurrentPasswordChange = (e) => {
    setSuccess(false);
    setCurrentPassword(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setSuccess(false);
    setNewPassword(e.target.value);
  };
  const handleConfirmNewPasswordChange = (e) => {
    setSuccess(false);
    setConfirmNewPassword(e.target.value);
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch("/api/profile/pwchange", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      // console.log(data);
      if (!response.ok) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setSuccess(true);
    } catch (error) {
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
        <RiLockPasswordFill />
        <span>Change Password</span>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordChangeSubmit}>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="currentPassword">
                Current Password
              </InputGroup.Text>
              <Form.Control
                aria-label="current password"
                aria-describedby="current password"
                type="password"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                disabled={isLoading}
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="newPassword">New Password</InputGroup.Text>
              <Form.Control
                aria-label="new password"
                aria-describedby="new password"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                disabled={isLoading}
                className={
                  passwordMatch === true
                    ? "passwordInputSuccess"
                    : passwordMatch === false
                    ? "passwordInputError"
                    : ""
                }
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="confirmNewPassword">
                Confirm New Password
              </InputGroup.Text>
              <Form.Control
                aria-label="confirm new password"
                aria-describedby="confirm new password"
                type="password"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
                disabled={isLoading}
                className={
                  passwordMatch === true
                    ? "passwordInputSuccess"
                    : passwordMatch === false
                    ? "passwordInputError"
                    : ""
                }
              />
            </InputGroup>
            {passwordMatch === false ? (
              <p className="errorText">
                <ImCross /> Passwords do not match
              </p>
            ) : passwordMatch === true ? (
              <p className="successtext">
                <FaCheck /> Passwords match
              </p>
            ) : null}
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
              message={isError.message || "Error changing password."}
            />
          )}
          {success && (
            <AlertSuccessMessage message={"Password changed successfully."} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
