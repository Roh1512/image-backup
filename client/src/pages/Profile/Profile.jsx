import BackButton from "../../components/BackButton/BackButton";
import Styles from "./Profile.module.css";
import { useCurrentUser } from "../../redux/user/userHooks";
import { formatDistanceToNow } from "date-fns";

import EditProfileModal from "../../components/EditProfile/EditProfileModal.jsx";
import ChangePasswordModal from "../../components/ChangePasswordModal/ChangePasswordModal.jsx";
import DeleteProfileModal from "../../components/DeleteProfileModal/DeleteProfileModal.jsx";
import LogoutButton from "../../components/buttons/LogoutButton/LogoutButton.jsx";
import { useState } from "react";
import EditProfilePicture from "../../components/EditProfilePicture/EditProfilePicture.jsx";

const Profile = () => {
  const [error, setError] = useState(false);
  const currentUser = useCurrentUser();
  // console.log(currentUser);
  const formattedCreatedDate =
    currentUser?.createdAt && !isNaN(new Date(currentUser.createdAt).getTime())
      ? formatDistanceToNow(new Date(currentUser.createdAt), {
          addSuffix: true,
        })
      : "Date not available";

  const formattedUpdatedDate =
    currentUser?.updatedAt && !isNaN(new Date(currentUser.updatedAt).getTime())
      ? formatDistanceToNow(new Date(currentUser.updatedAt), {
          addSuffix: true,
        })
      : "Date not available";

  return (
    <div className={Styles.profile}>
      <div className={Styles.topNav}>
        <BackButton />
        <LogoutButton setError={setError} />
      </div>
      {error && <p>Error Logging out</p>}
      <div className={Styles.userDetails}>
        <img
          src={currentUser.imageUrl}
          alt="Profile image"
          className={Styles.profileImg}
        />
        <EditProfilePicture />
        <h1 className={Styles.username}>{currentUser.username}</h1>
        <p className={Styles.userDetailsTextItem}>
          <strong className={Styles.detailName}>Email Id: </strong>
          {currentUser.email}
        </p>
        <p className={Styles.userDetailsTextItem}>
          <strong className={Styles.detailName}>Profile created:</strong>{" "}
          <em>{formattedCreatedDate}</em>
        </p>
        <p className={Styles.userDetailsTextItem}>
          <strong className={Styles.detailName}>Last updated:</strong>{" "}
          <em>{formattedUpdatedDate}</em>
        </p>
      </div>
      <div className={Styles.editButtons}>
        <EditProfileModal />
        <ChangePasswordModal />
      </div>
      <DeleteProfileModal />
    </div>
  );
};

export default Profile;
