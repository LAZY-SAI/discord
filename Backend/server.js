import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';
import ServerRoute from './route/server.route.js';

dotenv.config();

const app = express();
const PORT = 5000;

// HTTP Server
const httpServer = createServer(app);

// Express Middleware
app.use(cors({
  origin: "http://localhost:5173",
 methods: ["GET", "POST","DELETE"],
  credentials: true
}));
app.use(express.json());

// Socket.IO Server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST","DELETE"],
    credentials: true
  },
  path: '/socket.io' 
});



// Socket.io events
io.on("connection", (socket) => {
  console.log(`User connected `);

  socket.on("send_message", (message) => {
    console.log("Message received:", message);
    
    const newMessage = {
      name: message.name || "Anonymous",
      message: message.message,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all connected clients
    io.emit("receive_message", newMessage);
     console.log("message received", newMessage);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.use("/api/servers", ServerRoute);

// Start server
httpServer.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io endpoint: ws://localhost:${PORT}/socket.io`);
});


