import HeaderAuth from "../header/HeaderAuth";
import { Outlet } from "react-router-dom";

const LayoutAuth = () => {
  return (
    <>
      <HeaderAuth />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default LayoutAuth;
