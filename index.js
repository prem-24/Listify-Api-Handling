const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const app = express();
const PORT = 3000;

// Sample data
let mylist = [];

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== "Bearer xyzddd") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// CRUD Routes
app.get("/api/list", (req, res) => {
  res.json(mylist);
});

app.get("/api/list/:id", (req, res) => {
  const listItemID = parseInt(req.params.id);
  const listItem = mylist.find((item) => item.id === listItemID);
  if (!listItem) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.json(listItem);
});

app.post("/api/list", authenticate, (req, res) => {
  const { value } = req.body;
  let nextID = Math.max(...mylist.map((obj) => obj.id));
  const newItem = { id: nextID > 0 ? nextID + 1 : 1, value };
  mylist.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/list/:id", authenticate, (req, res) => {
  const listItemID = parseInt(req.params.id);
  const itemIndex = mylist.findIndex((item) => item.id === listItemID);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  const updatedItem = { ...mylist[itemIndex], ...req.body };
  mylist[itemIndex] = updatedItem;
  res.json(updatedItem);
});

app.delete("/api/list/:id", authenticate, (req, res) => {
  const listItemID = parseInt(req.params.id);
  mylist = mylist.filter((item) => item.id !== listItemID);
  res.json({ message: "Item deleted successfully" });
});

// Route with Response Type as Blob
app.get("/api/download", authenticate, (req, res) => {
  const filePath = path.join(__dirname, "assets/YOUR_FILE_NAME.EXT");
  const fileStream = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 });

  res.setHeader("Content-Disposition", 'attachment; filename="YOUR_FILE_NAME.EXT"');
  res.setHeader("Content-Type", "application/octet-stream");

  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    res.status(500).send("Internal Server Error");
  });

  fileStream.pipe(res);

  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    res.status(500).send("Internal Server Error");
  });

  fileStream.pipe(res);
});

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
// Set up multer with the storage configuration
const upload = multer({ storage });

app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ error: "Multer error: " + err.message });
    } else if (err) {
      // An unknown error occurred.
      return res.status(500).json({ error: "Internal server error" });
    }

    // File uploaded successfully.
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({
      fileName: req.file.filename,
      filePath: req.file.path,
      message: "File uploaded successfully",
    });
    res.json({
      fileName: req.file.filename,
      filePath: req.file.path,
      message: "File uploaded successfully",
    });
  });
});

// Stream video route with range support
app.post("/api/stream-video", authenticate, (req, res) => {
  const videoPath = path.join(__dirname, "assets", "YOUR_FILE_NAME.EXT");

  // Check if the video file exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: "Video not found" });
  }

  // Set the content type to video/mp4
  res.setHeader("Content-Type", "video/mp4");

  // Enable range requests
  res.setHeader("Accept-Ranges", "bytes");

  // Create a readable stream from the video file and pipe it to the response
  const videoStream = fs.createReadStream(videoPath);

  // Parse the range header if present
  const rangeHeader = req.headers.range;
  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : undefined;

    res.setHeader(
      "Content-Range",
      `bytes ${start}-${end}/${videoStream.length}`
    );
    res.setHeader(
      "Content-Length",
      end ? end - start + 1 : videoStream.length - start
    );
    videoStream.pipe(res);
  } else {
    videoStream.pipe(res);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
