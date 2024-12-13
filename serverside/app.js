require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Environment variables
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, username });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/messages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: true });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Socket.IO for Real-Time Messaging
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("register_online", (username) => {
    connectedUsers[username] = socket.id;
    console.log(`${username} is now online.`);

    io.emit("update_online_users", Object.keys(connectedUsers));
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    for (const [username, id] of Object.entries(connectedUsers)) {
      if (id === socket.id) {
        delete connectedUsers[username];
        console.log(`${username} went offline.`);
        break;
      }
    }

    io.emit("update_online_users", Object.keys(connectedUsers));
  });

  socket.on("private_message", async ({ sender, receiver, message }) => {
    console.log("Private message data:", { sender, receiver, message });

    const receiverSocketId = connectedUsers[receiver];
    const newMessage = new Message({ sender, receiver, message });

    try {
      await newMessage.save();
      console.log("Message saved to database:", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", { sender, message });
    }

    socket.emit("message_sent", { message });
  });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
