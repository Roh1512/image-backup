import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Styles from "./BackButton.module.css";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className={Styles.backButton}>
      <IoArrowBackCircleSharp />
    </button>
  );
};

export default BackButton;
