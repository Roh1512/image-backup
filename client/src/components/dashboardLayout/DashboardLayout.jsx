import { Outlet } from "react-router-dom";
import Styles from "./DashboardLayout.module.css";
import Footer from "../footer/Footer";
import HeaderAuth from "../header/HeaderAuth";

const DashboardLayout = () => {
  return (
    <>
      <HeaderAuth />
      <section className={Styles.dashboardDiv}>
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export default DashboardLayout;
