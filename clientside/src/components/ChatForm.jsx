import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { io } from "socket.io-client";

const socket = io("https://chatsocket-tg3j.onrender.com");

const ChatForm = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");  // The receiver will be selected from the dropdown
  const [onlineUsers, setOnlineUsers] = useState([]); // List of online users

  useEffect(() => {
    // Listen for the event that sends the updated list of online users
    socket.on("update_online_users", (users) => {
      setOnlineUsers(users);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("update_online_users");
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && receiver.trim()) {
      onSend(message, receiver);  // Pass both message and receiver to the handler
      setMessage("");  // Clear message input after sending
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderTop: "1px solid #ccc",
      }}
    >
      <FormControl fullWidth sx={{ marginRight: "10px" }}>
        <InputLabel>Receiver</InputLabel>
        <Select
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}  // Update receiver username
          label="Receiver"
        >
          {onlineUsers.map((user) => (
            <MenuItem key={user} value={user}>
              {user}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}  // Update message
        sx={{ marginRight: "10px" }}
      />
      <Button variant="contained" color="primary" onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
};

export default ChatForm;
