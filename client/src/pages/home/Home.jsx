import Styles from "./Home.module.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={Styles.homePageContainer}>
      <div className={Styles.heroContainer}>
        <div className={Styles.innerHeroDiv}>
          <h1>Welcome to media backup app.</h1>
          <p>Store your favourite Images & Videos in the cloud.</p>
          <div className={Styles.buttonsDiv}>
            <Button
              variant="primary"
              size="lg"
              className={Styles.buttons}
              onClick={() => navigate("/home/login")}
            >
              Login
            </Button>
            <Button
              variant="success"
              size="lg"
              className={Styles.buttons}
              onClick={() => navigate("/home/signup")}
            >
              Signup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
