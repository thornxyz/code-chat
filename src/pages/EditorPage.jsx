import { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from '../../Actions';
import { useLocation } from "react-router-dom";

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
    };
    init();
  }, []);
  const [clients, setClients] = useState([{ socketId: 1, username: "Thorn" }, { socketId: 2, username: "Joe" }]);
  return (
    <div className="flex w-screen h-screen bg-sky-950 text-white">
      <div className="border-r-2 border-black h-screen p-2 flex flex-col justify-between" style={{ width: '200px' }}>
        <div>
          <h3 className="text-center font-bold text-lg">Connected</h3>
          <div className="flex gap-4 justify-center items-center flex-wrap p-4">
            {
              clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))
            }
          </div>
        </div>
        <div className="flex flex-col">
          <button className="bg-green-700 px-4 py-1 mt-2 text-xl font-semibold rounded-lg hover:bg-green-900" >
            Copy Room Id
          </button>
          <button className="bg-red-700 px-4 py-1 mt-2 text-xl font-semibold rounded-lg hover:bg-red-900" >
            Leave
          </button>
        </div>
      </div>
      <div>
        <Editor />
      </div>
    </div>
  );
}

export default EditorPage;
