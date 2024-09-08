import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import { useTheme } from "../../context/themeContext/ThemeContext";
import AlertErrorMessage from "../AlertErrorMessage";
import AlertSuccessMessage from "../AlertSuccessMessage";
import useRefreshContext from "../../hooks/useRefreshContext";
const AddFile = () => {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);

  const [file, setFile] = useState(null); // To store the selected file
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // To store success or error message
  const [error, setError] = useState(null);
  const { refresh, setRefresh } = useRefreshContext();

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setFile(null);
    setError(false);
    setLoading(false);
    setMessage("");
  };
  const handleShow = () => {
    setShow(true);
    setFile(null);
    setError(false);
    setLoading(false);
    setMessage("");
  };

  const refreshComponent = () => {
    if (refresh >= 0 && refresh <= 2) {
      setRefresh((prev) => prev + 1);
    } else {
      setRefresh(0);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(false);
    setMessage("");
    setLoading(false);
  };

  const handleFileSUbmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);
      setMessage("");
      const response = await fetch("/api/files/add", {
        method: "POST",
        body: formData,
        credentials: "include", // Include credentials like cookies
      });
      const result = await response.json();
      // console.log("Upload Response: ", result);

      if (!response.ok) {
        throw new Error(result.message || "File upload failed.");
      }
      setMessage("File uploaded successfully!");
      setFile(null); // Reset file input
      setLoading(false);
      fileInputRef.current.value = "";
      refreshComponent();
    } catch (error) {
      console.error(error);
      setError(error.message || "Error uploading file.");
      setLoading(false);
    } finally {
      setLoading(false);
      setFile(null);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Ensure the file input is cleared
      }
    }
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Add File
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a file to upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFileSUbmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select a file to upload</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml, image/tiff, video/mp4, video/x-matroska, video/quicktime, video/x-msvideo, video/webm, video/3gpp"
                disabled={loading}
                ref={fileInputRef}
              />
            </Form.Group>

            {/* Show loading spinner while file is being uploaded */}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Uploading...</span>
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </Form>

          {/* Display error message if any */}
          {error && <AlertErrorMessage message={error} />}
          {message && <AlertSuccessMessage message={message} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddFile;
