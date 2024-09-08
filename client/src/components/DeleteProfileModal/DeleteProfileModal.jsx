import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useLoading, useError } from "../../redux/user/userHooks";
import { useTheme } from "../../context/themeContext/ThemeContext";
import Styles from "./DeleteProfileModal.module.css";
import AlertErrorMessage from "../AlertErrorMessage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";

import {
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../../redux/user/userSlice";

const DeleteProfileModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const isLoading = useLoading();
  const isError = useError();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleClose = () => {
    setPassword("");
    setShow(false);
    dispatch(deleteUserFailure(false));
  };
  const handleShow = () => {
    setPassword("");
    setShow(true);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      // console.log("Profile Delete Response: ", data);
      if (!response.ok) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/");
    } catch (error) {
      console.error(error);
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={handleShow}
        className="alignButtonContent"
      >
        <MdDelete />
        <span>Delete Profile</span>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDeleteSubmit}>
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
              <Button variant="danger" type="submit" disabled={isLoading}>
                {isLoading ? (
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
                  "Delete"
                )}
              </Button>
            </div>
          </Form>
          {isError && (
            <AlertErrorMessage
              message={isError.message || "Error deleting account."}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteProfileModal;
