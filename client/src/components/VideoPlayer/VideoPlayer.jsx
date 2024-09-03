import Styles from "./VideoPlayer.module.css";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";

const VideoPlayer = ({ url }) => {
  return (
    <>
      <div className={Styles.playerwrapper}>
        <ReactPlayer
          className={Styles.reactplayer}
          url={url}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
};

export default VideoPlayer;

VideoPlayer.propTypes = {
  url: PropTypes.string,
};
