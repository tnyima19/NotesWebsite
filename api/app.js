const mongoose = require('mongoose');
const  express = require('express');
const app = express();
const cors = require('cors');
const corsOptions={
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));
app.use(express.json());
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection succesxsufl');
}).catch(err => {
  //console.log(con.connections);
  console.log('DB connection successful',err);
});


// Mongoose schema:
//-------------------------------------------SCHEMA-----------



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

// const subfolderSchema = new mongoose.Schema({
//   subfolderName:{type:String, required:true},
//   folderId:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref:'Folder',
//     required:true
//   },
//   noteIds:[{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Note'
//   }]
// });

// subfolderSchema.index({subfolderName:1, folderId: 1}, {unique: true});
// const Subfolder = mongoose.model('Subfolder', subfolderSchema);

const folderSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  //userId: {
  //  type: mongoose.Schema.Types.ObjectId,
  //  ref: 'User',
  //  required: true
  //},
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

//folderSchema.index({folderName:1,userId: 1}, {unique: true})
const Folder = mongoose.model('Folder', folderSchema);

// Routes 
app.get('/folders', async (req, res) => {
  try{
    const folders  = await Folder.find().populate('notes'); 
    res.status(200).json(folders);
  } catch(err){
    console.error('Error fetching folders: ', err);
    res.status(500).json({message: 'failed to fetch folders', error: err.message});
  }
});

app.get('/folders/:folderId/notes/:noteId', async (req, res)=> {
  const {folderId, noteId} = req.params;
  try{
    
    const note = await Note.findOne({_id: noteId, folderId});
    if (!note){
      return res.status(404).send({message: 'Note not found'});
    }

    res.status(200).json({note});
  }catch(err){
    console.error('Failed to fetch note', err);
    res.status(500).send({message: 'Error fetching note',error: err.message});
  }
});

app.delete('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await Folder.findById(folderId);

    // Ensure folder exists
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Delete all associated notes first, if necessary
    await Note.deleteMany({ folderId: folder._id });

    // Delete the folder itself
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
    // Find the note within the specified folder and delete it
    const note = await Note.findOneAndDelete({ _id: noteId, folderId });

    // Check if the note was found
    if (!note) {
      return res.status(404).json({ message: 'Note not found or does not belong to the specified folder' });
    }

    // Also remove the note reference from the folder's notes array
    await Folder.findByIdAndUpdate(folderId, { $pull: { notes: noteId } });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Failed to delete note:', err);
    res.status(500).json({ message: 'Error deleting note', error: err.message });
  }
});
app.get('/folders/:folderId', async(req, res)=>{
  const {folderId}= req.params;
  console.log('folder id: ',folderId);

  try{
    const folder = await Folder.findById(folderId).populate('notes');
    if(!folder){
      return res.status(404).json({message: 'Folder not found'});
    }
    res.json(folder);
  }catch(err){
    console.error('Failed to fetch folder: ', err);
    res.status(500).json({message: 'Error fetching folder', error: err.message});
  }
});

app.post('/folders/:folderId/notes', async (req, res) => {
    const { folderId } = req.params;
    const { title, content } = req.body;
    console.log('title: ', title);
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
        console.log('Note: ', note);
        console.log('Note id: ', note._id);

        folder.notes.push(note._id);
        await folder.save();

        res.status(201).json({ message: 'Note created successfully', note });
    } catch (err) {
        console.error('Failed to create note: ', err);
        res.status(500).json({ message: 'Failed to create note', error: err.message });
    }
});

app.put('/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    console.log('title note: ', title);
    console.log('content: ', content);
    
    try {
        const note = await Note.findByIdAndUpdate(noteId, { title, content }, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (err) {
        console.error('Failed to update note: ', err);
        res.status(500).json({ message: 'Failed to update note', error: err.message });
    }
});

app.post('/create-folder', async(req,res) =>{
  console.log('req: ',req.body);
  const {folderName} = req.body;
  try{
    const existingFolder = await Folder.findOne({folderName});
    if (existingFolder){
      return res.status(409).json({message: 'Folder already exists'});
    }
    const newFolder = new Folder({
      folderName,
      notes:[]
    });

    await newFolder.save();
    res.status(201).json({message:'Folder created successfully', folder: newFolder});

  }catch(error){
    console.error('Failed to create folder: ',error);
    res.status(500).json({message:'Failed to create folder: ', error:error.message});
  }
});



const port = 4000;
app.listen(port, () =>{
  console.log(`App running on port ${port}`);
});




// const express = require("express");
// const morgan = require("morgan");
// const path = require("path");
// const db = require("./models");
// const app = express();
// const PORT = process.env.PORT;

// // this lets us parse 'application/json' content in http requests
// app.use(express.json());

// // add http request logging to help us debug and audit app use
// const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
// app.use(morgan(logFormat));

// // this mounts controllers/index.js at the route `/api`
// app.use("/api", require("./controllers"));

// // for production use, we serve the static react build folder
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));

//   // all unknown routes should be handed to our react app
//   app.get("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "../client/build", "index.html"));
//   });
// }

// // update DB tables based on model updates. Does not handle renaming tables/columns
// // NOTE: toggling this to true drops all tables (including data)
// db.sequelize.sync({ force: false });

// // start up the server
// if (PORT) {
//   app.listen(PORT, () => console.log(`Listening on ${PORT}`));
// } else {
//   console.log("===== ERROR ====\nCREATE A .env FILE!\n===== /ERROR ====");
// }
