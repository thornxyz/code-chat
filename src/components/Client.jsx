import Avatar from "react-avatar";

function Client({ username }) {
  return (
    <div className="flex flex-col items-center text-sm font-semibold">
      <Avatar name={username} size={30} round="15px" />
    </div>
  );
}

export default Client;
