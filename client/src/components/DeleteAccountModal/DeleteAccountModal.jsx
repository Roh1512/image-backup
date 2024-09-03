import Styles from "./DeleteAccountModal.module.css";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const profileUrl = "/users/profile";

const DeleteAccountModal = ({ show, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.delete(profileUrl);
      import.meta.env.DEV && console.log(response);
      setSuccess(true);
      handleClose();
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      setError("Error Deleting Account.");
      import.meta.env.DEV && console.log(error);
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
        <Modal.Body>
          <p>Deleting Account will delete all the files in this account</p>
        </Modal.Body>
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
          <Button variant="danger" onClick={deleteAccount} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Deleting Account...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteAccountModal;

DeleteAccountModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};
