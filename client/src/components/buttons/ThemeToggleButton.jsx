import { useTheme } from "../../context/themeContext/ThemeContext";
import { RiMoonClearFill } from "react-icons/ri";
import { PiSunHorizonFill } from "react-icons/pi";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="themeButton">
      {theme === "light" ? <RiMoonClearFill /> : <PiSunHorizonFill />}
    </button>
  );
};

export default ThemeToggleButton;
