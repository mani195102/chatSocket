import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { io } from "socket.io-client";
import ChatMessages from "../components/ChatMessages";
import ChatForm from "../components/ChatForm";
import axios from "axios";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(""); // Current chat receiver
  const username = localStorage.getItem("username");
  
  const socketRef = useRef(null); // Store socket in useRef to maintain connection

  useEffect(() => {
    // Initialize socket connection and store it in the ref
    socketRef.current = io("https://chatsocket-tg3j.onrender.com");

    // Listen for the connection event
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      socketRef.current.emit("register_online", username);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Listen for incoming messages
    socketRef.current.on("receive_message", (msg) => {
      if (msg.sender === receiver || msg.receiver === receiver) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Clean up the socket connection on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [username, receiver]);

  // Fetch chat messages for the selected receiver
  useEffect(() => {
    if (receiver) {
      axios
        .get(`https://chatsocket-tg3j.onrender.com/messages/${username}/${receiver}`)
        .then((response) => {
          setMessages(response.data); // Load messages for the current chat
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    } else {
      setMessages([]); // Clear messages when no receiver is selected
    }
  }, [receiver, username]);

  // Handle sending a message
  const handleSend = (message, selectedReceiver) => {
    if (socketRef.current && selectedReceiver) {
      const msg = { sender: username, receiver: selectedReceiver, message };
      socketRef.current.emit("private_message", msg); // Emit the message to the server
      setMessages((prev) => [...prev, msg]); // Append the sent message locally
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        height: "80vh",
        overflow: "auto",
        width: "100%",
      }}
    >
      <ChatMessages messages={messages} username={username} />
      <ChatForm
        onSend={handleSend}
        setReceiver={setReceiver} // Pass the setReceiver function to update receiver dynamically
      />
    </Box>
  );
};

export default ChatPage;
