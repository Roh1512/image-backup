import styles from "./Videos.module.css";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useRefreshContext from "../../hooks/useRefreshContext";
import { Link } from "react-router-dom";
import LoadingElement from "../../components/LoadingElement/LoadingElement";
import VideoIcon from "../../components/Icons/VideoIcon";

const URL = "/files";

const Videos = () => {
  const { refresh } = useRefreshContext();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(URL, {
          params: {
            type: "VIDEO",
            page: currentPage,
            limit: 10,
          },
        });
        import.meta.env.DEV && console.log(response.data.files);
        setVideos(response.data.files);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setIsLoading(false);
        setError("Error fetching videos.");
        import.meta.env.DEV && console.log("Error fetichin videos: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, [currentPage, refresh]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingElement />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className={styles.allVideosDiv}>
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video.id} className={styles.videoDiv}>
                  <Link to={`${video.id}`} className={styles.videoLink}>
                    <VideoIcon />
                    <p>{video.name}</p>
                  </Link>
                </div>
              ))
            ) : (
              <p>No Videos to show</p>
            )}
          </div>
          {videos.length > 0 && totalPages > 1 && (
            <div className={styles.pagination}>
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              )}
              <span>
                Page {currentPage} of {totalPages}
              </span>
              {!(currentPage === totalPages) && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Videos;
