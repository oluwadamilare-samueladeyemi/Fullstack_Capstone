import "dotenv/config";
import dns from "dns";
import express from "express";
import mongoose from "mongoose";

// Local-dev workaround: some networks refuse SRV lookups
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Allow Express to read JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('The Skill server is running!');
});

// Basic health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});


// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
});

// Connect to MongoDB, then start the server
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();