import Styles from "./LoadingAnimation.module.css";
import Spinner from "react-bootstrap/esm/Spinner";

const LoadingAnimation = () => {
  return (
    <div className={Styles.LoadingAnimation}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingAnimation;
