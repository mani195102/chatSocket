import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { io } from "socket.io-client";
import ChatMessages from "../components/ChatMessages";
import ChatForm from "../components/ChatForm";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const username = localStorage.getItem("username");
  
  const socketRef = useRef(null);  // Store socket in useRef to maintain connection

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

    // Listen for messages
    socketRef.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);
  useEffect(() => {
    setMessages([]); // Clear chat messages
  }, [receiver]);
            
  // Handle sending a message
  const handleSend = (message, receiver) => {
    if (socketRef.current && receiver) {    
      const msg = { sender: username, receiver, message };
  
      
      if (username === receiver) {
        setMessages((prev) => [...prev, msg]); 
      } else {
        socketRef.current.emit("private_message", msg); 
        setMessages((prev) => [...prev, msg]); 
      }
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
      <ChatForm onSend={handleSend} />
    </Box>
  );
};

export default ChatPage;
