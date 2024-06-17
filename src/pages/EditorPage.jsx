
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Chat from "../components/Chat";

function EditorPage() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };

    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, [reactNavigator, roomId, location.state?.username]);

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

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex w-screen h-screen bg-sky-950 text-white">
      <div className="border-r-2 border-black h-screen p-2 flex flex-col justify-between" style={{ width: "200px" }}>
        <div>
          <h3 className="text-center font-bold text-lg">Connected</h3>
          <div className="flex gap-4 justify-center items-center flex-wrap p-4">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <button
            onClick={copyRoomId}
            className="bg-green-700 px-4 py-1 mt-2 text-xl font-semibold rounded-lg hover:bg-green-900"
          >
            Copy Room Id
          </button>
          <button
            onClick={leaveRoom}
            className="bg-red-700 px-4 py-1 mt-2 text-xl font-semibold rounded-lg hover:bg-red-900"
          >
            Leave
          </button>
        </div>
      </div>
      <div >
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
      <div >
        <Chat socketRef={socketRef} username={location.state.username} room={roomId} />
      </div>
    </div>
  );
}

export default EditorPage;