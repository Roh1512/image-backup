import homeIcon from "../../assets/logo.svg";
import Styles from "./HeaderAuth.module.css";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ProfileIcon from "../Icons/ProfileIcon";

const HeaderAuth = () => {
  return (
    <>
      <header>
        <Link to="/dashboard" className={Styles.homeLink}>
          <div className={Styles.logo}>
            <img src={homeIcon} className={Styles.homeIcon} />
            <h1 className={Styles.logoText}>Home</h1>
          </div>
        </Link>
        <NavLink to="profile" className={Styles.linkDivItem}>
          <ProfileIcon />
        </NavLink>
      </header>
    </>
  );
};

export default HeaderAuth;
