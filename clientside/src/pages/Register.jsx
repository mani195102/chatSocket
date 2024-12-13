import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/register", { username, password });
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.error || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        margin: "auto",
        marginTop: "0px",
        padding: "20px",
        display: "flex",
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Register
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
        onClick={handleRegister}
        sx={{ marginTop: "20px", width: "100%" }}
      >
        Register
      </Button>
      <Typography variant="body2" sx={{ marginTop: "16px" }}>
        Already have an account?{' '}
        <Link href="/login" underline="hover">
          Log in
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
  