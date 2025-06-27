import Dserver from "../model/serverSchema.js";
import mongoose from "mongoose";

export const getServer = async (req, res) => {
  try {
    const servers = await Dserver.find().sort({ createdAt: -1 });
    res.json(servers);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch servers",
      error: error.message 
    });
  }
};

export const CreateServer = async (req, res) => {
  try {
    const { serverName, serverIcon } = req.body;
    
    if (!serverName) {
      return res.status(400).json({ message: 'Server name is required' });
    }

    const newServer = new Dserver({
      serverName,
      serverIcon: serverIcon || "https://i.imgur.com/8nLFCVP.png",
    });

    await newServer.save();
    
    res.status(201).json({ 
      message: 'Server created successfully',
      newServer: {
        _id: newServer._id,
        serverName: newServer.serverName,
        serverIcon: newServer.serverIcon,
        createdAt: newServer.createdAt
      }
    });
  } catch (error) {
    console.error("Server creation error:", error);
    res.status(500).json({ 
      message: "Server creation failed",
      error: error.message 
    });
  }
};

export const deleteServer = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid server ID" });
    }

    const deletedServer = await Dserver.findByIdAndDelete(id);
    
    if (!deletedServer) {
      return res.status(404).json({ message: "Server not found" });
    }
    
    res.status(200).json({ 
      message: 'Server deleted successfully',
      deletedServer: {
        _id: deletedServer._id,
        name: deletedServer.serverName
      }
    });
  } catch (error) {
    console.error("Server deletion error:", error);
    res.status(500).json({ 
      message: "Failed to delete server",
      error: error.message 
    });
  }
};