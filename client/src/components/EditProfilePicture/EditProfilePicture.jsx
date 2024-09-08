import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTheme } from "../../context/themeContext/ThemeContext";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useLoading, useError } from "../../redux/user/userHooks";
import AlertErrorMessage from "../AlertErrorMessage";
import Spinner from "react-bootstrap/esm/Spinner";

const EditProfilePicture = () => {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const loading = useLoading();
  const error = useError();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateProfilePicture = async (e) => {
    e.preventDefault();
    if (!image) {
      dispatch(updateUserFailure({ message: "Please choose a file." }));
      return;
    }
    try {
      dispatch(updateUserStart());
      const formData = new FormData();
      formData.append("profileImage", image);
      const response = await fetch("/api/profile/profileimagechange", {
        method: "PUT",
        credentials: "include", // include cookies
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        dispatch(updateUserFailure(result));
        return;
      }
      dispatch(updateUserSuccess(result));
      handleClose();
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Edit Profile Picture
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateProfilePicture}>
            <InputGroup size="sm" className="mb-3">
              <Form.Control
                aria-label="Small"
                aria-describedby="profile_image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </InputGroup>
            <div className="modalButtonsDiv">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="success" type="submit">
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
                  "Update"
                )}
              </Button>
            </div>
          </Form>
          {error && (
            <AlertErrorMessage
              message={error.message || "Error changing profile picture"}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfilePicture;
