import { Outlet, NavLink } from "react-router-dom";
import styles from "./FilesLayout.module.css";
import { useState } from "react";
import AddFileIcon from "../Icons/AddFileIcon";
import { Button } from "react-bootstrap";
import AddFileModal from "../AddFileModal/AddFileModal";

const FilesLayout = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <div className={styles.filesLayout}>
        <div className={styles.navLinks}>
          <NavLink
            to="images"
            className={({ isActive }) =>
              isActive ? styles.link + " " + styles.activeLink : styles.link
            }
          >
            Images
          </NavLink>
          <NavLink
            to="/dashboard/videos"
            className={({ isActive }) =>
              isActive ? styles.link + " " + styles.activeLink : styles.link
            }
          >
            Videos
          </NavLink>
          <div className={styles.linkDiv}>
            <Button
              variant="warning"
              className={styles.addBtnGroup}
              onClick={handleShow}
            >
              <AddFileIcon />
              Add
            </Button>
            <AddFileModal show={show} handleClose={handleClose} />
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default FilesLayout;
