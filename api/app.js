const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));
app.use(express.json());
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const axios = require('axios'); // Import axios for making API requests
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
}).catch(err => {
  console.log('DB connection error', err);
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
  }
});

noteSchema.index({ title: 1, folderId: 1 }, { unique: true });
const Note = mongoose.model('Note', noteSchema);

const folderSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

const Folder = mongoose.model('Folder', folderSchema);

// Routes for folders and notes
app.get('/folders', async (req, res) => {
  try {
    const folders = await Folder.find().populate('notes');
    res.status(200).json(folders);
  } catch (err) {
    console.error('Error fetching folders:', err);
    res.status(500).json({ message: 'Failed to fetch folders', error: err.message });
  }
});

app.get('/folders/:folderId/notes/:noteId', async (req, res) => {
  const { folderId, noteId } = req.params;
  try {
    const note = await Note.findOne({ _id: noteId, folderId });
    if (!note) {
      return res.status(404).send({ message: 'Note not found' });
    }
    res.status(200).json({ note });
  } catch (err) {
    console.error('Failed to fetch note', err);
    res.status(500).send({ message: 'Error fetching note', error: err.message });
  }
});

app.delete('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    await Note.deleteMany({ folderId: folder._id });
    await Folder.findByIdAndDelete(folder._id);
    res.status(200).json({ message: 'Folder deleted successfully', folderId });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Error deleting folder', error: error.message });
  }
});

app.delete('/folders/:folderId/notes/:noteId', async (req, res) => {
  const { folderId, noteId } = req.params;
  try {
    const note = await Note.findOneAndDelete({ _id: noteId, folderId });
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

app.get('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findById(folderId).populate('notes');
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.json(folder);
  } catch (err) {
    console.error('Failed to fetch folder:', err);
    res.status(500).json({ message: 'Error fetching folder', error: err.message });
  }
});

app.post('/folders/:folderId/notes', async (req, res) => {
  const { folderId } = req.params;
  const { title, content } = req.body;
  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    const existingNote = await Note.findOne({ title, folderId });
    if (existingNote) {
      return res.status(409).json({ message: `A note with the title "${title}" already exists in this folder.` });
    }
    const note = new Note({
      title,
      content,
      folderId
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

app.put('/notes/:noteId', async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(noteId, { title, content }, { new: true });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (err) {
    console.error('Failed to update note:', err);
    res.status(500).json({ message: 'Failed to update note', error: err.message });
  }
});

app.post('/create-folder', async (req, res) => {
  const { folderName } = req.body;
  try {
    const existingFolder = await Folder.findOne({ folderName });
    if (existingFolder) {
      return res.status(409).json({ message: 'Folder already exists' });
    }
    const newFolder = new Folder({
      folderName,
      notes: []
    });
    await newFolder.save();
    res.status(201).json({ message: 'Folder created successfully', folder: newFolder });
  } catch (error) {
    console.error('Failed to create folder:', error);
    res.status(500).json({ message: 'Failed to create folder', error: error.message });
  }
});

// Routes for image generation and fetching
app.get('/get-images', async (req, res) => {
  try {
    // Replace with your logic to fetch images
    const response = await axios.get('https://your-image-api.com/get-images');
    res.status(200).json({ images: response.data });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;
  try {
    // Replace with your logic to generate image based on the prompt
    const response = await axios.post('https://your-image-api.com/generate-image', { prompt });
    res.status(200).json({ imageUrl: response.data.imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
