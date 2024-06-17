import Avatar from "react-avatar";

function Client({ username }) {
  return (
    <div className="font-semibold cursor-pointer">
      <Avatar name={username} size={30} round="15px" />
    </div>
  );
}

export default Client;
