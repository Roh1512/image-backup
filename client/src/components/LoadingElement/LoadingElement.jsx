import { Spinner } from "react-bootstrap";
import styles from "./LoadingElement.module.css";

const LoadingElement = () => {
  return (
    <>
      <div className={styles.mainDiv}>
        <Spinner animation="border" variant="light" />
      </div>
    </>
  );
};

export default LoadingElement;
