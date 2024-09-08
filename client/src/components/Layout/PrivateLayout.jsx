import { Outlet } from "react-router-dom";
import ThemeToggleButton from "../buttons/ThemeToggleButton";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PrivateLayout = () => {
  const navigate = useNavigate();
  return (
    <>
      <header>
        <Link to="/" className="homeLinkDiv" aria-description="home">
          <img src={logo} alt="home logo icon" className="logoIcon" />
          Dashboard
        </Link>
        <nav className="protectedNav">
          <button
            className="profileButton"
            onClick={() => navigate("/profile")}
          >
            <FaUserCog />
          </button>
          <ThemeToggleButton />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>
          &#169; {new Date().getFullYear()}{" "}
          <a href="https://github.com/Roh1512" target="blank">
            Roh1512
          </a>
        </p>
      </footer>
    </>
  );
};

export default PrivateLayout;
