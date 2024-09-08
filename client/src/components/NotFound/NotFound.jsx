import { useNavigate } from "react-router-dom";
import Styles from "./NotFound.module.css";
import Button from "react-bootstrap/esm/Button";
import BackButton from "../BackButton/BackButton";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <BackButton />
      <div className={Styles.container}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <div className={Styles.buttonDiv}>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
