import { Modal, Button, Spinner } from "react-bootstrap";
import Styles from "./AddFileModal.module.css";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import useRefreshContext from "../../hooks/useRefreshContext";

const URL = "/files/addnew";

const AddFileModal = ({ show, handleClose }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { refresh, setRefresh } = useRefreshContext();
  const location = useLocation();
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const refreshComponent = () => {
    if (refresh >= 0 && refresh <= 2) {
      setRefresh((prev) => prev + 1);
    } else {
      setRefresh(0);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(false); // Clear previous errors
    setSuccess(false); // Clear previous success messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setError(false);
      setSuccess(false);
      const response = await axiosPrivate.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      import.meta.env.DEV &&
        console.log("File uploaded successfully", response.data);
      setSuccess("File uploaded successfully");
      setError(false);
      setFile(false); // Clear file input
      navigate(location.pathname + location.search);
      handleClose();
      refreshComponent();
    } catch (error) {
      setError("Error uploading file.");
      setIsLoading(false);
      import.meta.env.DEV && console.error("Error uploading file", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      variant="dark"
      dialogClassName={Styles.modal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add a New File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="errmsg">{error}</p>}
        {success && <p className="successmsg">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml, image/tiff, video/mp4, video/x-matroska, video/quicktime, video/x-msvideo, video/webm, video/3gpp"
            onChange={handleFileChange}
            disabled={isLoading} // Disable during upload
          />
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Uploading File...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </form>
        {isLoading && (
          <p className={Styles.warningText}>
            Do not close this while uploading a file
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFileModal;

AddFileModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  refreshComponent: PropTypes.func,
};
