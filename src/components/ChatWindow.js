import React from "react";

const ChatWindow = ({
  socketConnected,
  messages,
  input,
  setInput,
  sendMessage,
  loading,
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-500 text-white text-lg px-4 py-2 flex justify-between items-center">
        <h2>Pulsar - IT Copilot Assisatant</h2>
        <span
          className={`text-xs ${
            socketConnected ? "text-green-300" : "text-red-400"
          }`}
        >
          {socketConnected ? "Online" : "Offline"}
        </span>
      </div>

      <div
        className="p-4 h-96 overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
          </div>
        ))}

        {/* {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))} */}
        {loading && (
          <div className=" mb-2 flex justify-start ">
            <div className="text-center text-gray-500">Loading...</div>{" "}
          </div>
        )}
      </div>

      <div className="flex p-4 border-t border-gray-200">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
