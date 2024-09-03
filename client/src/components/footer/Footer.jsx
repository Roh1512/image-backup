import Styles from "./Footer.module.css";
function Footer() {
  const date = new Date().getFullYear();
  return (
    <>
      <footer>
        <p className={Styles.copyrightText}>
          <span>&#169;</span> Copyright {date}
        </p>
      </footer>
    </>
  );
}

export default Footer;
