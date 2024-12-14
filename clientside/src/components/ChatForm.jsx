import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { io } from "socket.io-client";

const socket = io("https://chatsocket-tg3j.onrender.com");

const ChatForm = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(""); // The selected receiver
  const [onlineUsers, setOnlineUsers] = useState([]); // List of online users

  useEffect(() => {
    // Listen for the updated list of online users
    socket.on("update_online_users", (users) => {
      setOnlineUsers(users);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off("update_online_users");
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && receiver.trim()) {
      onSend(message, receiver); // Send both message and receiver
      setMessage(""); // Clear message input
    }
  };

  const handleReceiverChange = (event) => {
    const newReceiver = event.target.value;
    console.log("Receiver changed to:", newReceiver);
    setReceiver(newReceiver);
    setMessage("");
    console.log("Message cleared");
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
      {/* Receiver Dropdown */}
      <FormControl fullWidth sx={{ marginRight: "10px" }}>
        <InputLabel>Receiver</InputLabel>
        <Select
          value={receiver}
          onChange={handleReceiverChange} // Clear message when receiver changes
          label="Receiver"
        >
          {onlineUsers.map((user) => (
            <MenuItem key={user} value={user}>
              {user}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Message Input */}
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update the message state
        sx={{ marginRight: "10px" }}
      />

      {/* Send Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        disabled={!message.trim() || !receiver.trim()} // Disable if input is empty
      >
        Send
      </Button>
    </Box>
  );
};

export default ChatForm;
