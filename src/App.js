import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("https://c118-147-161-160-186.ngrok-free.app", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setSocketConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setSocketConnected(false);
    });

    socketRef.current.on("message", (message) => {
      const response = { text: message };
      setMessages((prevMessages) => [...prevMessages, response]);
    });

    const introMessage = {
      text: "👋 Hi there! I'm Pulsar - IT Copilot Assistant, here to help you. Feel free to ask any questions you have!",
      sender: "bot",
    };
    setMessages([introMessage]);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, sender: "user" };
      socketRef.current.emit("message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <ChatWindow
        socketConnected={socketConnected}
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default App;
