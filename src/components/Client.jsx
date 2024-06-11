import Avatar from "react-avatar";

function Client({ username }) {
  return (
    <div className="flex flex-col items-center text-sm font-semibold">
      <Avatar name={username} size={50} round="14px" />
      <span>{username}</span>
    </div>
  );
}

export default Client;
