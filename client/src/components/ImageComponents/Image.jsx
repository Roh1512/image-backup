import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./Image.module.css";
import { useState } from "react";
import LoadingElement from "../LoadingElement/LoadingElement";
import PropTypes from "prop-types";

const ImageSmall = ({ url, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };
  return (
    <div className={styles.imageDiv}>
      {isLoading && <LoadingElement />}
      {isError && <div>Error loading image.</div>}
      <LazyLoadImage
        src={url}
        alt="Product"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${styles.image} ${
          isLoading ? styles.hidden : ""
        }`}
      />
    </div>
  );
};

export default ImageSmall;

ImageSmall.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
};
