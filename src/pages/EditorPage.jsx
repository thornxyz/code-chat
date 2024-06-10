import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex w-screen h-screen bg-sky-950 text-white">
      <div
        className="border-r-2 border-black h-screen p-2 flex flex-col justify-between"
        style={{ width: "200px" }}
      >
        <div>
          <h3 className="text-center font-bold text-lg">Connected</h3>
          <div className="flex gap-4 justify-center items-center flex-wrap p-4">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <button className="bg-green-700 px-4 py-1 mt-2 text-xl font-semibold rounded-lg hover:bg-green-900">
            Copy Room Id
          </button>
          <button className="bg-red-700 px-4 py-1 mt-2 text-xl font-semibold rounded-lg hover:bg-red-900">
            Leave
          </button>
        </div>
      </div>
      <div>
        <Editor socketRef={socketRef} roomId={roomId} />
      </div>
    </div>
  );
}

export default EditorPage;
