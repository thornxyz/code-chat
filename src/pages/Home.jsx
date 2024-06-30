import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room Id and Username are required");
      return;
    }

    navigate(`/editor/${roomId}`, { state: { username } });
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("New Room Created");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-400">
      <div className="bg-zinc-600 p-6 rounded-lg w-full max-w-sm m-4 flex flex-col items-center">
        <div className="font-semibold text-white py-1 mb-4 text-3xl">
          Join a room
        </div>
        <input
          type="text"
          className="w-full py-2 px-2 my-2 rounded-sm"
          placeholder="Paste Room Id"
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
          onKeyUp={handleInputEnter}
        />
        <input
          type="text"
          className="w-full py-2 px-2 my-2 rounded-sm mb-7"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          onKeyUp={handleInputEnter}
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 my-1 rounded-md w-full py-2 text-white font-semibold text-lg hover:bg-blue-700"
        >
          Join
        </button>
        <div className="text-white font-medium">Or</div>
        <button
          onClick={createNewRoom}
          className="bg-green-700 my-1 rounded-md w-full py-2 text-white font-semibold text-lg hover:bg-green-900"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
}

export default Home;
