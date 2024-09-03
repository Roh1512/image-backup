import Styles from "./Unauthorized.module.css";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../components/BackIcon/BackIcon";
import { Button } from "react-bootstrap";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <>
      <section className={Styles.section}>
        <h1>Unauthorized</h1>
        <br />
        <p>You do not have access to the requested page.</p>
        <div className="flexGrow">
          <button onClick={goBack} className={Styles.backButton}>
            <BackIcon />
          </button>
          <Button onClick={goBack} variant="warning" size="lg">
            Go Back
          </Button>
        </div>
      </section>
    </>
  );
};

export default Unauthorized;
