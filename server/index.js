const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database");

    // Set up middleware with larger request body size limit
    app.use(
      cors({
        origin: "http://localhost:3000", // Allow requests from your React app
        credentials: true, // Allow credentials (cookies, HTTP authentication)
      })
    );
    app.use(cookieParser());
    
    // Increase body size limit to 10MB (adjust as needed)
    app.use(express.json({ limit: '10mb' }));  // Increase the limit for JSON payloads
    app.use(express.urlencoded({ limit: '10mb', extended: true }));  // Increase the limit for URL-encoded data

    // Add routes
    app.use("/users", require("./routes/userRoutes"));
    app.use("/projects", require("./routes/projectRoutes"));
    app.use("/contributions", require("./routes/ContributionsRoutes"));
    app.use("/likes", require("./routes/likesRoutes"));
    app.use("/comments", require("./routes/commentRoute"));

    app.use("/", authRoute);

    // TODO - remove later
    app.get("/test", (req, res) => {
      res.send("This is a test endpoint");
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();
