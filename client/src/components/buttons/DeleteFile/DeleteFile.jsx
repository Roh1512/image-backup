import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { MdDelete } from "react-icons/md";
import { useTheme } from "../../../context/themeContext/ThemeContext";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/esm/Spinner";

const DeleteFile = ({ id }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    setShow(false);
    setError(false);
    setLoading(false);
  };
  const handleShow = () => {
    setShow(true);
    setError(false);
    setLoading(false);
  };

  console.log(id);

  const handleDeleteFile = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        setError(result.message || "Error deleting file");
        setLoading(false);
        return;
      }
      setLoading(false);
      handleClose();
      navigate(-1);
    } catch (error) {
      setError(error.message || "Error deleting file.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="danger" className="buttonWithIcon" onClick={handleShow}>
        <MdDelete /> Delete
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
        <Modal.Body className="modalButtonsDiv">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            No
          </Button>
          <Button
            variant="danger"
            disabled={loading}
            onClick={handleDeleteFile}
          >
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
              "Yes"
            )}
          </Button>
        </Modal.Body>
        {error && <Modal.Footer>{error}</Modal.Footer>}
      </Modal>
    </>
  );
};
DeleteFile.propTypes = {
  id: PropTypes.string,
};
export default DeleteFile;
