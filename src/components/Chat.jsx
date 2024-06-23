import { useEffect, useRef, useState } from "react";
import sendlogo from "./send.svg";

function Chat({ socketRef, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageEndRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage.trim(),
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      if (socketRef.current) {
        await socketRef.current.emit("send_message", messageData);
        setMessageList((prevMessages) => [...prevMessages, messageData]);
        setCurrentMessage("");
      }
    }
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const handleMessageReceive = (data) => {
      setMessageList((prevMessages) => [...prevMessages, data]);
    };

    const handleJoin = ({ messages }) => {
      setMessageList(messages);
    };

    if (socketRef.current) {
      socketRef.current.on("receive_message", handleMessageReceive);
      socketRef.current.on("joined", handleJoin);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message", handleMessageReceive);
        socketRef.current.off("joined", handleJoin);
      }
    };
  }, [socketRef.current]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <div className="border-l flex flex-col justify-center bg-gray-800">
      <div
        className="bg-gray-800 text-white py-2 px-1 overflow-auto h-full pt-6"
        style={{ width: "300px" }}
        ref={messageEndRef}
      >
        {messageList.map((msg, index) => (
          <div className="mb-1" key={index}>
            {username === msg.author ? (
              <div className="flex flex-col items-end">
                <div
                  className="bg-green-800 rounded-md px-1 py-0.5 text-sm"
                  style={{
                    width: "160px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  <p>{msg.message}</p>
                </div>
                <div className="flex gap-1" style={{ fontSize: "11px" }}>
                  <p>{msg.time}</p>
                  <p className="font-semibold">{msg.author}</p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="bg-gray-600 rounded-md px-1 py-0.5 text-sm"
                  style={{
                    width: "160px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  <p>{msg.message}</p>
                </div>
                <div className="flex gap-1" style={{ fontSize: "11px" }}>
                  <p>{msg.time}</p>
                  <p className="font-semibold">{msg.author}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between m-1 mb-4">
        <input
          type="text"
          className="border-black border px-2 py-1 text-black rounded-sm w-full text-sm"
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
          placeholder="Enter your message"
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button
          className="bg-green-700 hover:bg-green-900 rounded-lg ml-1 p-1"
          onClick={sendMessage}
        >
          <img src={sendlogo} width={30} alt="send" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
