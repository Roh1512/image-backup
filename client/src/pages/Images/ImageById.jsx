import styles from "./ImageById.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Image, Button, Spinner } from "react-bootstrap";
import BackIcon from "../../components/BackIcon/BackIcon";
import DeleteFileModal from "../../components/DeleteFileModal/DeleteFileModal";
import LoadingElement from "../../components/LoadingElement/LoadingElement";

const URL = "/files";

const ImageById = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [image, setImage] = useState({});
  const { imageid } = useParams();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const response = await axiosPrivate.get(`${URL}/${imageid}`);
        import.meta.env.DEV && console.log(response);
        setImage(response.data);
      } catch (error) {
        setIsLoading(false);
        setError("Error Fetching images.");
        import.meta.env.DEV && console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, [imageid]);

  const handleDownload = async () => {
    const fileUrl = image.url; // Assuming 'image.url' is the Cloudinary URL
    const fileName = image.name; // Assuming 'image.name' is the desired filename

    try {
      setIsDownloading(true);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the download attribute with the desired filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setIsDownloading(false);
      import.meta.env.DEV && console.error("Download failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingElement />
      ) : error ? (
        <p>Error fetching images</p>
      ) : (
        <>
          <BackIcon />
          <div className={styles.imageDiv}>
            <Image src={image.url} fluid className={styles.image} />
            <h4>{image.name}</h4>
            <p>Created at {new Date(image.createdAt).toDateString()}</p>
            <div className={styles.buttonDiv}>
              <Button
                variant="success"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Downloading...
                  </>
                ) : (
                  "Download"
                )}
              </Button>
              <Button variant="danger" onClick={handleShow}>
                Delete
              </Button>
            </div>
            <DeleteFileModal
              show={show}
              handleClose={handleClose}
              file={image}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ImageById;
