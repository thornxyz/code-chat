import Client from "./Client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Navbar({ clients, roomId }) {
  const reactNavigator = useNavigate();

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy room ID");
      console.error(err);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
  };

  return (
    <div className="flex justify-between my-0.5 mx-2">
      <div className="flex gap-2">
        {clients.map((client) => (
          <Client key={client.socketId} username={client.username} />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={copyRoomId}
          className="bg-green-700 px-2 py-0.5 text-sm font-semibold rounded-lg hover:bg-green-900"
        >
          Copy Room Id
        </button>
        <button
          onClick={leaveRoom}
          className="bg-red-700 px-2 py-0.5 text-sm font-semibold rounded-lg hover:bg-red-900"
        >
          Leave
        </button>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  clients: PropTypes.array.isRequired,
  roomId: PropTypes.string.isRequired,
};

export default Navbar;
