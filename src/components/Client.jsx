import Avatar from "react-avatar";
import PropTypes from "prop-types";

function Client({ username }) {
  return (
    <div className="font-semibold cursor-pointer">
      <Avatar name={username} size={30} round="15px" />
    </div>
  );
}

Client.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Client;
