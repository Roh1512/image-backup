import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Style from "./LandingPage.module.css";
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import LoadingElement from "../../components/LoadingElement/LoadingElement";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  useEffect(() => {
    const connectToServer = async () => {
      try {
        setIsLoading(true);
        console.log("Attempting to connect...");
        const response = await axios.get("/");
        console.log("Connected to server:", response);
        setConnected(true);
      } catch (error) {
        console.error("Error connecting to server:", error);
        setConnected(false);
      } finally {
        setIsLoading(false);
        console.log("Finished attempting connection.");
      }
    };
    connectToServer();
  }, []);
  return (
    <>
      {isLoading && <LoadingElement />}
      {connected && !isLoading && (
        <div className={Style.mainDiv}>
          <div className={Style.heroDiv}>
            <div className={Style.heroInnerDiv}>
              <h1>Welcome to Media Backup App</h1>
              <p>Store your favourite Images & Videos in the cloud.</p>
            </div>
          </div>
          <div className={Style.buttonDiv}>
            <Link to="/login">
              <Button variant="primary" size="lg" className={Style.linkButton}>
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="success" size="lg" className={Style.linkButton}>
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
      {!connected && (
        <div className={Style.mainDiv}>
          <p>Error connecting to server.</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      )}
    </>
  );
};

export default LandingPage;
