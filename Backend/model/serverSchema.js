

import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  serverIcon: { type: String, default: "https://i.imgur.com/9Q9QZ9L.png" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Server', serverSchema);