import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const ChatForm = ({ onSend, setReceiver }) => {
  const [message, setMessage] = useState("");
  const [receiver, updateReceiver] = useState(""); // Manage the local receiver
  const [onlineUsers, setOnlineUsers] = useState([]); // List of online users

  useEffect(() => {
    const socket = io("https://chatsocket-tg3j.onrender.com");

    // Listen for updated online users
    socket.on("update_online_users", (users) => {
      setOnlineUsers(users);
    });

    // Clean up the socket listener when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle receiver change
  const handleReceiverChange = (e) => {
    const selectedReceiver = e.target.value;
    updateReceiver(selectedReceiver); // Update local receiver
    setReceiver(selectedReceiver); // Update receiver in parent component
  };

  const handleSend = () => {
    if (message.trim() && receiver.trim()) {
      onSend(message, receiver); // Pass message and receiver to parent handler
      setMessage(""); // Clear message input
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
          onChange={handleReceiverChange} // Handle receiver change
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
        onChange={(e) => setMessage(e.target.value)} // Update message
        sx={{ marginRight: "10px" }}
      />
      <Button variant="contained" color="primary" onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
};

export default ChatForm;
