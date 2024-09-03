import styles from "./Images.module.css";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Image from "../../components/ImageComponents/Image";
import { Link } from "react-router-dom";
import LoadingElement from "../../components/LoadingElement/LoadingElement";
import useRefreshContext from "../../hooks/useRefreshContext";

const URL = "/files";

const Images = () => {
  const { refresh } = useRefreshContext();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(URL, {
          params: {
            type: "IMAGE",
            page: currentPage,
            limit: 10,
          },
        });
        import.meta.env.DEV && console.log(response.data);
        setImages(response.data.files);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setIsLoading(false);
        setError("Error fetching images");
        import.meta.env.DEV && console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [currentPage, refresh]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to apply transformations to the image URL
  const getTransformedUrl = (url) => {
    // Insert your desired transformations here, e.g., resizing to 300x300 pixels.
    const transformation = "c_fill,q_auto,f_auto";
    // The transformation needs to be inserted right after the "upload" part of the URL.
    const splitUrl = url.split("/upload/");
    return `${splitUrl[0]}/upload/${transformation}/${splitUrl[1]}`;
  };

  return (
    <>
      {isLoading ? (
        <LoadingElement />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className={styles.allImagesDiv}>
            {images.length > 0 &&
              images.map((image) => (
                <div key={image.id} className={styles.imageDiv}>
                  <Link to={`${image.id}`}>
                    <Image
                      url={getTransformedUrl(image.url)}
                      className={styles.image}
                    />
                  </Link>
                </div>
              ))}
          </div>
          {!images.length && (
            <p className={styles.noImage}>No images to show.</p>
          )}
          {images.length > 0 && totalPages > 1 && (
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

export default Images;
