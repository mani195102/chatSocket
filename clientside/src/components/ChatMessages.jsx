import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

const ChatMessages = ({ messages, username }) => {
  const chatEndRef = useRef(null);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to format the timestamp
  const formatTimestamp = () => {
    const date = new Date();
    console.log(date);
    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Fallback if the timestamp is invalid
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });    // You can use .toLocaleString() for full date if needed
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        padding: "10px",
        borderBottom: "1px solid #ccc",
      }}
    >
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: msg.sender === username ? "flex-end" : "flex-start",
            marginBottom: "10px",
          }}
        >
          <Box
            sx={{
              padding: "10px",
              borderRadius: "8px",
              backgroundColor:
                msg.sender === username ? "primary.main" : "grey.300",
              color: msg.sender === username ? "#fff" : "#000",
              maxWidth: "60%",
            }}
          >
            <Typography variant="body2">
              {msg.sender !== username && <strong>{msg.sender}: </strong>}
              {msg.message}
            </Typography>
            {/* Display timestamp with fallback */}
            <Typography
              variant="caption"
              sx={{ display: "block", marginTop: "4px", textAlign: "right" }}
            >
              {formatTimestamp(msg.timestamp)}
            </Typography>
          </Box>
        </Box>
      ))}
      {/* Scroll to the latest message */}
      <div ref={chatEndRef} />
    </Box>
  );
};

export default ChatMessages;
