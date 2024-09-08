import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/esm/Spinner";
import { FaDownload } from "react-icons/fa";

import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import BackButton from "../../components/BackButton/BackButton";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import Button from "react-bootstrap/esm/Button";
import DeleteFile from "../../components/buttons/DeleteFile/DeleteFile";
const FileById = () => {
  const { fileId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState({});
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const type = file.type;

  useEffect(() => {
    const fetchFile = async () => {
      setDownloadError(false);
      setDownloadLoading(false);
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`/api/files/${fileId}`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        // console.log("Fetched File: ", result);
        if (!response.ok) {
          setError(error.message || "Error fetching file.");
          return;
        }
        setFile(result);
        setError(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message || "Error fetching file.");
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [fileId]);

  const handleDownload = async () => {
    const fileUrl = file.url;
    const fileName = file.name;
    try {
      setDownloadLoading(true);
      setDownloadError(false);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      if (!response.ok) {
        throw new Error("Error downloading image");
      }
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the download attribute with the desired filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadLoading(false);
    } catch (error) {
      setDownloadError(error || "Error downloading file.");
    } finally {
      setDownloadError(false);
    }
  };
  return (
    <>
      <BackButton />
      {loading ? (
        <LoadingAnimation />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="fileItemDiv">
          {type === "IMAGE" || type === "image" ? (
            <Image src={file.url} className="imageSingleFile" fluid />
          ) : type === "VIDEO" || type === "video" ? (
            <VideoPlayer url={file.url} />
          ) : (
            <p>Unsupported file type</p>
          )}
          <p>{file.name}</p>
          <div className="fileButtonsDiv">
            <Button
              variant="success"
              onClick={handleDownload}
              className="buttonWithIcon"
              disabled={downloadLoading}
            >
              {downloadLoading ? (
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
                <>
                  <FaDownload /> <span>Download</span>
                </>
              )}
            </Button>
            <DeleteFile id={file.id} />
          </div>
          {downloadError && <p>{downloadError}</p>}
        </div>
      )}
    </>
  );
};

export default FileById;
