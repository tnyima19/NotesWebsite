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

mongoose.connect(DB, {
  useNewUrlParser:true,
  useUnifiedTopology:true,
}).then( () => {
  //console.log(con.connections);
  console.log('DB connection successful')
})

// Mongoose schema:
//-------------------------------------------SCHEMA-----------



const noteSchema = new mongoose.Schema({ 
  title: {type: String, unique: true, required: true},
  date: String,
  content: String,
  subfolderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subfolder',
    required: true 
  }
  //{type: String,require: [true, 'note must have content']}
});

noteSchema.index({title:1, subfolderId:1},{unique:true});
const Note = mongoose.model('Note', noteSchema);

const subfolderSchema = new mongoose.Schema({
  subfolderName:{type:String, required:true},
  folderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Folder',
    required:true
  },
  noteIds:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

subfolderSchema.index({subfolderName:1, folderId: 1}, {unique: true});
const Subfolder = mongoose.model('Subfolder', subfolderSchema);

const folderSchema = new mongoose.Schema({
  folderName:{type: String, required: true},
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  subfolderIds:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Subfolder'
  }]
});


folderSchema.index({folderName:1,userId: 1}, {unique: true})
const Folder = mongoose.model('Folder', folderSchema);

const userSchema = new mongoose.Schema({
  username:{type: String, unique: true, required: true},
  folderIds:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Folder'
  }]
});
//-----------------------------------------------

DB.Users 
//const Note = mongoose.model('Note', noteSchema);
const User = mongoose.model('User', userSchema);

async function createDataStructure() {
    try {
        // Create Subfolders first
        const subfolderVacations = await new Subfolder({
            subfolderName: "Vacations"
        }).save();

        const subfolderBooks = await new Subfolder({
            subfolderName: "Books"
        }).save();

        const subfolderProjectAlpha = await new Subfolder({
            subfolderName: "Project Alpha"
        }).save();

        // Now create Notes with the corresponding subfolderId
        const note1 = await new Note({
            title: "Trip to Hawaii",
            content: "Planning our family trip to Hawaii next summer.",
            subfolderId: subfolderVacations._id
        }).save();

        const note2 = await new Note({
            title: "Reading List",
            content: "1. Dune 2. Foundation 3. Hyperion",
            subfolderId: subfolderBooks._id
        }).save();

        const note3 = await new Note({
            title: "Meeting Notes",
            content: "Meeting with the design team at 3 PM on Thursday.",
            subfolderId: subfolderProjectAlpha._id
        }).save();

        // Create Folders with subfolderIds
        const folderPersonal = await new Folder({
            folderName: "Personal",
            subfolderIds: [subfolderVacations._id, subfolderBooks._id]
        }).save();

        const folderWork = await new Folder({
            folderName: "Work",
            subfolderIds: [subfolderProjectAlpha._id]
        }).save();

        // Create User with folderIds
        const user = await new User({
            username: "testUser123",
            folderIds: [folderPersonal._id, folderWork._id]
        }).save();

        console.log('User with nested folders and notes created:', user);
    } catch (err) {
        console.log('ERROR:', err);
    }
}

createDataStructure().catch(err => {
    console.log('ERROR:', err);
});async function createDataStructure() {
    try {
        // Create the user first (optional: can be created last as well)
        const user = new User({
            username: "testUser123"
        });
        await user.save();

        // Create Folders and link them to the user
        const folderPersonal = await new Folder({
            folderName: "Personal",
            userId: user._id  // Linking folder to the user
        }).save();

        const folderWork = await new Folder({
            folderName: "Work",
            userId: user._id  // Linking folder to the user
        }).save();

        // Create Subfolders linked to their respective folders
        const subfolderVacations = await new Subfolder({
            subfolderName: "Vacations",
            folderId: folderPersonal._id  // Linking subfolder to the personal folder
        }).save();

        const subfolderBooks = await new Subfolder({
            subfolderName: "Books",
            folderId: folderPersonal._id  // Linking subfolder to the personal folder
        }).save();

        const subfolderProjectAlpha = await new Subfolder({
            subfolderName: "Project Alpha",
            folderId: folderWork._id  // Linking subfolder to the work folder
        }).save();

        // Create Notes with the corresponding subfolderId
        const note1 = await new Note({
            title: "Trip to Hawaii",
            content: "Planning our family trip to Hawaii next summer.",
            subfolderId: subfolderVacations._id
        }).save();

        const note2 = await new Note({
            title: "Reading List",
            content: "1. Dune 2. Foundation 3. Hyperion",
            subfolderId: subfolderBooks._id
        }).save();

        const note3 = await new Note({
            title: "Meeting Notes",
            content: "Meeting with the design team at 3 PM on Thursday.",
            subfolderId: subfolderProjectAlpha._id
        }).save();

        console.log('User with nested folders and notes created:', user);
    } catch (err) {
        console.error('ERROR:', err);
    }
}

createDataStructure().catch(err => {
    console.error('ERROR:', err);
});

// Routes 
app.get('/', (req, res) => {
  res
    .status(200)
    .json({message: 'Hello from the server side', app: 'Natours'});
});

// app.post('/', async (req,res) =>{
//   console.log(" i am here",req.body);
//   const {title, content} = req.body;
//   const date = (currentDate.getMonth()+1).toString()+"/"+currentDate.getDate().toString()+"/"+currentDate.getFullYear().toString();
//   try{
//     console.log("i am inside try")
//     const newNote = await Note.create({
//       title,
//       date,
//       content
//     });

//     // newNote
//     //   .save()
//     //   .then(doc =>{
//     //   console.log(doc);
//     // })
//     //   .catch(err =>{
//     //     console.log('Note saving error Error: ',err);
//     //   });
    
    
//     res.status(201).json({
//       status: 'success',
//       data:{
//         note: newNote
//       }
//     });
    

//   } catch(err){
//     res.status(400).json({
//       status:'we have fail',
//       message: err.message 
//     });
//   }


// });

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
