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
    <div className="w-screen flex flex-col items-center bg-sky-950 h-screen text-white pt-12">
      <div className="text-3xl font-semibold my-8">
        Paste invitation for Room Id
      </div>
      <div className="flex flex-col w-1/2 items-center gap-3">
        <input
          type="text"
          className="px-2 py-1 rounded-sm text-black"
          style={{ width: "350px" }}
          placeholder="Room Id"
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
          onKeyUp={handleInputEnter}
        />
        <input
          type="text"
          className="px-2 py-1 rounded-sm text-black"
          style={{ width: "350px" }}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          onKeyUp={handleInputEnter}
        />
        <button
          onClick={joinRoom}
          className="bg-green-700 px-4 py-1 mt-2 text-xl font-semibold rounded-md hover:bg-green-900"
        >
          Join
        </button>
        <span>
          If you dont have an invite then create &nbsp;
          <a
            onClick={createNewRoom}
            className="text-green-600 hover:text-green-800 font-semibold"
            href=""
          >
            New Room
          </a>
        </span>
      </div>
    </div>
  );
}

export default Home;
