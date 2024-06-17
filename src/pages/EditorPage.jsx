import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";

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

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients: newClients, username, socketId }) => {
          setClients(newClients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        setClients((prevClients) =>
          prevClients.filter((client) => client.socketId !== socketId)
        );
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
      }
    };
  }, [reactNavigator, roomId, location.state?.username]);

  useEffect(() => {
    if (socketRef.current) {
      const handleJoin = ({ clients: newClients, username }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(newClients);
      };

      const handleDisconnect = ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prevClients) =>
          prevClients.filter((client) => client.socketId !== socketId)
        );
      };

      socketRef.current.on(ACTIONS.JOINED, handleJoin);
      socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnect);

      return () => {
        socketRef.current.off(ACTIONS.JOINED, handleJoin);
        socketRef.current.off(ACTIONS.DISCONNECTED, handleDisconnect);
      };
    }
  }, [location.state?.username, socketRef.current]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-sky-950 text-white">
      <Navbar clients={clients} roomId={roomId} />
      <div className="flex border-t">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
        <Chat
          socketRef={socketRef}
          username={location.state.username}
          room={roomId}
        />
      </div>
    </div>
  );
}

export default EditorPage;
