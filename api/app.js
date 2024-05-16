<<<<<<< HEAD
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const db = require("./models");
const app = express();
const PORT = process.env.PORT;

// this lets us parse 'application/json' content in http requests
app.use(express.json());

// add http request logging to help us debug and audit app use
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

// this mounts controllers/index.js at the route `/api`
app.use("/api", require("./controllers"));

// for production use, we serve the static react build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  // all unknown routes should be handed to our react app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// update DB tables based on model updates. Does not handle renaming tables/columns
// NOTE: toggling this to true drops all tables (including data)
db.sequelize.sync({ force: false });

// start up the server
if (PORT) {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
} else {
  console.log("===== ERROR ====\nCREATE A .env FILE!\n===== /ERROR ====");
}
=======
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const axios = require('axios');

dotenv.config({ path: './config.env' });

const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));
app.use(express.json());

const serviceAccount = require('./firebase/notescape-login-firebase-adminsdk-xnnk4-466ffeb27b.json'); // Ensure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
}).catch(err => {
  console.log('DB connection error:', err);
});

// Mongoose schemas
const noteSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  date: String,
  content: String,
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  userId: { type: String, required: true }
});

noteSchema.index({ title: 1, folderId: 1, userId: 1 }, { unique: true });
const Note = mongoose.model('Note', noteSchema);

const folderSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  userId: { type: String, required: true }
});

folderSchema.index({ folderName: 1, userId: 1 }, { unique: true });
const Folder = mongoose.model('Folder', folderSchema);

// Middleware to check user authentication
const checkAuth = async (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.status(403).send('Unauthorized');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).send('Unauthorized');
  }
};

// Apply authentication middleware to subsequent routes
app.use(checkAuth);

// Authenticated routes
app.get('/users/:userId/search-images', async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }

  const query = req.query.q;
  try {
    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: 'AIzaSyCiIL4099cxkmEb2QqKAQHi3ZltsDK1IyU',
        cx: '40d891c7af6ea46f2', // Replace with your Custom Search Engine ID
        searchType: 'image',
        q: query,
        num: 5
      }
    });
    const images = response.data.items.map(item => ({
      id: item.cacheId,
      src: item.link
    }));
    res.json(images);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
});


app.get('/users/:userId/folders', async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  try {
    const folders = await Folder.find({ userId }).populate('notes');
    res.status(200).json(folders);
  } catch (err) {
    console.error('Error fetching folders:', err);
    res.status(500).json({ message: 'Failed to fetch folders', error: err.message });
  }
});

app.get('/users/:userId/folders/:folderId/notes/:noteId', async (req, res) => {
  const { userId, folderId, noteId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  try {
    const note = await Note.findOne({ _id: noteId, folderId, userId });
    if (!note) {
      return res.status(404).send({ message: 'Note not found' });
    }
    res.status(200).json({ note });
  } catch (err) {
    console.error('Failed to fetch note', err);
    res.status(500).send({ message: 'Error fetching note', error: err.message });
  }
});

app.delete('/users/:userId/folders/:folderId', async (req, res) => {
  const { userId, folderId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  try {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    await Note.deleteMany({ folderId: folder._id, userId });
    await Folder.findByIdAndDelete(folder._id);
    res.status(200).json({ message: 'Folder deleted successfully', folderId });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Error deleting folder', error: error.message });
  }
});

app.delete('/users/:userId/folders/:folderId/notes/:noteId', async (req, res) => {
  const { userId, folderId, noteId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  try {
    const note = await Note.findOneAndDelete({ _id: noteId, folderId, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or does not belong to the specified folder' });
    }
    await Folder.findByIdAndUpdate(folderId, { $pull: { notes: noteId } });
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Failed to delete note:', err);
    res.status(500).json({ message: 'Error deleting note', error: err.message });
  }
});

app.get('/users/:userId/folders/:folderId', async (req, res) => {
  const { userId, folderId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  try {
    const folder = await Folder.findOne({ _id: folderId, userId }).populate('notes');
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.json(folder);
  } catch (err) {
    console.error('Failed to fetch folder:', err);
    res.status(500).json({ message: 'Error fetching folder', error: err.message });
  }
});

app.post('/users/:userId/folders', async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  const { folderName } = req.body;
  try {
    const existingFolder = await Folder.findOne({ folderName, userId });
    if (existingFolder) {
      return res.status(409).json({ message: 'Folder already exists' });
    }
    const newFolder = new Folder({
      folderName,
      userId,
      notes: []
    });
    await newFolder.save();
    res.status(201).json({ message: 'Folder created successfully', folder: newFolder });
  } catch (err) {
    console.error('Failed to create folder:', err);
    res.status(500).json({ message: 'Failed to create folder', error: err.message });
  }
});

app.post('/users/:userId/folders/:folderId/notes', async (req, res) => {
  const { userId, folderId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  const { title, content } = req.body;
  try {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    const existingNote = await Note.findOne({ title, folderId, userId });
    if (existingNote) {
      return res.status(409).json({ message: `A note with the title "${title}" already exists in this folder.` });
    }
    const note = new Note({
      title,
      content,
      folderId,
      userId
    });
    await note.save();
    folder.notes.push(note._id);
    await folder.save();
    res.status(201).json({ message: 'Note created successfully', note });
  } catch (err) {
    console.error('Failed to create note:', err);
    res.status(500).json({ message: 'Failed to create note', error: err.message });
  }
});

app.put('/users/:userId/notes/:noteId', async (req, res) => {
  const { userId, noteId } = req.params;
  if (userId !== req.userId) {
    return res.status(403).send('Unauthorized');
  }
  const { title, content } = req.body;
  try {
    const note = await Note.findOneAndUpdate({ _id: noteId, userId }, { title, content }, { new: true });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (err) {
    console.error('Failed to update note:', err);
    res.status(500).json({ message: 'Failed to update note', error: err.message });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
>>>>>>> cacb9ba (Pushing all changes to the main branch fully functional and completed)
