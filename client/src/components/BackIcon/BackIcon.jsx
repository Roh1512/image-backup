import Styles from "./BackIcon.module.css";
import { useNavigate } from "react-router-dom";
const BackIcon = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <>
      <button className={Styles.backIconButton} onClick={goBack}>
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-4 ${Styles.backIcon}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
        </>
      </button>
    </>
  );
};

export default BackIcon;
