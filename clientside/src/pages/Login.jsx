import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      alert("Login successful");
      localStorage.setItem("token", data.token); // Store the token
      localStorage.setItem("username", data.username);
      navigate("/chat");
    } catch (error) {
      alert(error.response.data.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        margin: "auto",
        marginTop: "100px",
        padding: "20px",
        display: "flex",
        backgroundColor:"#fff",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        sx={{ marginTop: "20px", width: "100%" }}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
