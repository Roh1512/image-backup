import { Outlet, NavLink } from "react-router-dom";
import AddFile from "../AddFile/AddFile";

const DashboardLayout = () => {
  return (
    <>
      <nav className="dashboardNav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "dashboardNavLink dashboardNavLinkActive"
              : "dashboardNavLink"
          }
        >
          Images
        </NavLink>
        <NavLink
          to="/videos"
          className={({ isActive }) =>
            isActive
              ? "dashboardNavLink dashboardNavLinkActive"
              : "dashboardNavLink"
          }
        >
          Videos
        </NavLink>
        <AddFile />
      </nav>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
