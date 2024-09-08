import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import useRefreshContext from "../../hooks/useRefreshContext";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import { MdVideoLibrary } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const Videos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const { refresh } = useRefreshContext();
  const limit = 6;

  useEffect(() => {
    const fetchFiles = async (page) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/files?page=${currentPage}&limit=${limit}&type=VIDEO`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("Videos fetched, page = ", page, " ", data);
        if (!response.ok) {
          setLoading(false);
          setError(data.message || "Error fetching files");
          return;
        }
        setVideos(data.files);
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
    fetchFiles();
  }, [currentPage, refresh]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="videosDiv">
      {loading ? (
        <LoadingAnimation />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="videoItems">
          {videos.map((item) => (
            <div
              key={item.id}
              className="videoItem"
              onClick={() => navigate(`/file/${item.id}`)}
            >
              <MdVideoLibrary className="videoIcon" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
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
  );
};

export default Videos;
