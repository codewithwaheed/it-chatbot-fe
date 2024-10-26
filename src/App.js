import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import ChatWindow from "./components/ChatWindow";
import Axios from "./Axios";

const App = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    const createChatSession = async () => {
      try {
        const response = await Axios.get("/chat/create"); // Use the Axios instance
        setChatId(response.data.chatId);
        console.log("Chat ID:", response.data.chatId);
      } catch (error) {
        console.error("Error creating chat session:", error);
      }
    };

    createChatSession();
  }, []);

  useEffect(() => {
    socketRef.current = io("https://9e0b-147-161-160-186.ngrok-free.app", {
      transports: ["websocket"],
    });

    // Handle socket connection
    socketRef.current.on("connect", () => {
      console.log("conncted");
      setSocketConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setSocketConnected(false);
    });

    socketRef.current.on("message", (message) => {
      console.log({ message });
      const payload = { text: message, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    console.log({ messages });

    // Add introductory message from bot on load
    const introMessage = {
      text: "👋 Hi there! I'm IT Copilot Assistant, here to help you. Feel free to ask any questions you have!",
      sender: "bot",
    };
    setMessages([introMessage]);

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  console.log({ chatId });

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user", chatId };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setLoading(true); // Set loading to true
      setInput("");

      try {
        const response = await Axios.post("/chat", { message: input, chatId }); // Call the chat endpoint
        const botMessage = {
          text: response.data.text,
          sender: "bot",
        };
        console.log({ message: response.data });
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
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
        loading={loading}
      />
    </div>
  );
};

export default App;
