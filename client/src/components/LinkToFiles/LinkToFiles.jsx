import { Button } from "react-bootstrap";
import Styles from "./LinkToFiles.module.css";
import { useNavigate } from "react-router-dom";

const LinkToFiles = () => {
  const navigate = useNavigate();
  return (
    <div className={Styles.container}>
      <h1>Welcome to our App.</h1>
      <p>Back up your favourite photos and videos.</p>
      <div className={Styles.linksContainer}>
        <Button variant="warning" size="lg" onClick={() => navigate("images")}>
          View All Images
        </Button>
        <Button variant="info" size="lg" onClick={() => navigate("videos")}>
          View All Videos
        </Button>
      </div>
    </div>
  );
};

export default LinkToFiles;
