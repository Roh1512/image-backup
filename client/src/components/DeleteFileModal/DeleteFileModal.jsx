import Styles from "./DeleteFileModal.module.css";
import { Modal, Button, Spinner } from "react-bootstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const DELETE_URL = "/files";

const DeleteFileModal = ({ show, handleClose, file }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const goToImages = () => {
    navigate("/dashboard/images");
  };

  const deleteFile = async () => {
    try {
      setError(false);
      setSuccess(false);
      setIsLoading(true);
      const response = await axiosPrivate.delete(`${DELETE_URL}/${file.id}`);
      import.meta.env.DEV && console.log("Delete Response: " + response);
      setSuccess("File Deleted Successfully.");
      goToImages();
    } catch (error) {
      setIsLoading(false);
      setSuccess(false);
      import.meta.env.DEV && console.log(error);
      setError("Error Deleting File");
    } finally {
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
      >
        {error && <p className="errmsg">{error}</p>}
        {success && <p className="successmsg">{success}</p>}
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
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
              </>
            ) : (
              "No"
            )}
          </Button>
          <Button variant="danger" onClick={deleteFile} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </>
            ) : (
              "Yes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteFileModal;

DeleteFileModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  file: PropTypes.object,
};
