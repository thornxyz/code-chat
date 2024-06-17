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
      <div className="text-2xl font-bold mb-8" style={{ marginTop: "20vh" }}>
        Paste invitation for Room Id
      </div>
      <div className="flex flex-col w-1/2 items-center gap-4">
        <input
          type="text"
          className="px-2 py-1 rounded-sm text-black"
          style={{ width: "30vw" }}
          placeholder="Room Id"
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
          onKeyUp={handleInputEnter}
        />
        <input
          type="text"
          className="px-2 py-1 rounded-sm text-black"
          style={{ width: "30vw" }}
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
        <div className="mt-4">
          If you dont have an invite then create &nbsp;
          <span
            onClick={createNewRoom}
            className="bg-green-700 hover:bg-green-900 px-2 py-1 rounded-md font-semibold cursor-pointer"
            href=""
          >
            New Room
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
