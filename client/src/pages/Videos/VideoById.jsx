import Styles from "./VideoById.module.css";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import BackIcon from "../../components/BackIcon/BackIcon";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingElement from "../../components/LoadingElement/LoadingElement";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { Button, Spinner } from "react-bootstrap";
import DeleteFileModal from "../../components/DeleteFileModal/DeleteFileModal";

const URL = "/files";

const VideoById = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [video, setVideo] = useState({});
  const { videoid } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const response = await axiosPrivate.get(`${URL}/${videoid}`);
        import.meta.env.DEV && console.log(response);
        setVideo(response.data);
      } catch (error) {
        setIsLoading(false);
        setError("Error Fetching Videos.");
        import.meta.env.DEV && console.log("Error fetching videos: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, [videoid]);

  const handleDownload = async () => {
    const fileUrl = video.url; // Assuming 'image.url' is the Cloudinary URL
    const fileName = video.name; // Assuming 'image.name' is the desired filename

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
        <p>Error fetching Video</p>
      ) : (
        <>
          <BackIcon />
          <div className={Styles.VideoDiv}>
            <VideoPlayer url={video.url} />
            <h1>{video.name}</h1>
            <div className={Styles.buttonDiv}>
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
              file={video}
            />
          </div>
        </>
      )}
    </>
  );
};

export default VideoById;
