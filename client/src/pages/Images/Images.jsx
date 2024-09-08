import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Styles from "./Images.module.css";
import useRefreshContext from "../../hooks/useRefreshContext";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Images = () => {
  const navigate = useNavigate();
  const { refresh } = useRefreshContext();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const limit = 6; // Number of items per page

  const fetchFiles = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/files?page=${page}&limit=${limit}&type=IMAGE`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      // console.log("Images fetched, page = ", page, " ", data);
      if (!response.ok) {
        setLoading(false);
        setError(data.message || "Error fetching files");
        return;
      }
      setImages(data.files);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage, refresh]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={Styles.imagesDiv}>
      {loading ? (
        <div className={Styles.loadingDiv}>
          <Spinner animation="border" role="status" className={Styles.center}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className={Styles.itemDivContainer}>
          <div className={Styles.itemsListContainer}>
            {images.map((file) => (
              <div
                key={file.id}
                className={Styles.itemDiv}
                onClick={() => navigate(`file/${file.id}`)}
              >
                <img className={Styles.image} src={file.url} />
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="pagination">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <GrPrevious />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <GrNext />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Images;
