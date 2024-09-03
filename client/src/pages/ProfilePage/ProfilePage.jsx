import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import LoadingElement from "../../components/LoadingElement/LoadingElement";
import ErrorElement from "../../components/ErrorElement/ErrorElement";
import styles from "./ProfilePage.module.css";
import BackIcon from "../../components/BackIcon/BackIcon";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import EditPassword from "../../components/EditPassword/EditPassword";
import DeleteAccountModal from "../../components/DeleteAccountModal/DeleteAccountModal";

const profilePath = "/users/profile";

const ProfilePage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showPWModel, setShowPWModel] = useState(false);

  const handlePWModalClose = () => setShowPWModel(false);
  const handlePWModalShow = () => setShowPWModel(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const logout = useLogout();

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const signOut = async () => {
    try {
      setLoading(true);
      await logout();
      navigate("/login");
    } catch (error) {
      setError(error?.response || "An error occurred while logging out.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(profilePath);
        import.meta.env.DEV && console.log(response.data);
        setProfileData(response.data);
      } catch (err) {
        import.meta.env.DEV && console.log(err);
        setError(
          err?.response || "An error occurred while fetching the profile data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [show]);

  if (loading) {
    return (
      <div className={styles.loadingDiv}>
        <LoadingElement />
      </div>
    );
  }

  if (error) {
    return <ErrorElement error={error} />;
  }

  return (
    <>
      <BackIcon />
      <div className={styles.profileDiv}>
        <div className={styles.profileButtons}>
          <Button variant="outline-info" onClick={handleShow}>
            Edit Profile
          </Button>
          <EditProfileModal
            user={profileData}
            show={show}
            handleClose={handleClose}
          />
          <Button variant="danger" onClick={signOut}>
            Logout
          </Button>
        </div>
        <p>
          <strong>Username:</strong> {profileData.username}
        </p>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(profileData.createdAt).toLocaleDateString()}
        </p>
        {/* Add more profile details as needed */}
        <Button
          variant="warning"
          onClick={openDeleteModal}
          className={styles.DeleteAccountBtn}
        >
          Delete Account
        </Button>
        <br />
        <br />
        <Button variant="outline-warning" onClick={handlePWModalShow}>
          Change Password
        </Button>
        <DeleteAccountModal
          show={showDeleteModal}
          handleClose={closeDeleteModal}
        />
        <EditPassword show={showPWModel} handleClose={handlePWModalClose} />
      </div>
    </>
  );
};

export default ProfilePage;
