import React, { useState, useEffect,useReducer } from 'react'; // Import React and its hooks for state and side effects. 
//This line imports the React library and two hooks, useState and useEffect, from the React package. 
//These hooks are essential for managing state and performing side effects in functional components.
import {useNavigate} from 'react-router-dom';
import SubNoteModalPage from './SubNoteModalPage';
import HomepageLeftBar from "../components/HomepageLeftBar"; // Import the HomepageLeftBar component
import TrashButton from "../components/TrashButton"; // Import the TrashButton component
import hamBurgerMenuImg from '../pages/hamburger-menu-5.png'; // Import the the hamburger menu image
import ThemeButton from "../components/ThemeButton"; // Import the ThemeButton component
import '../pages/Homepage.css'; // Import the Homepage CSS file
import { reducer,initialState } from '../reducer';
import axios from 'axios';
// var link = document.createElement("link"); // Create a new <link> element
// link.rel = "stylesheet"; // Set the 'rel' attribute to 'stylesheet'
// link.href = "https://fonts.googleapis.com/css?family=Tangerine"; // Set the 'href' attribute to the Google Fonts URL
// document.head.appendChild(link); // Append the <link> element to the document head



function Homepage() { // Define the Homepage component

    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [newFolderName, setNewFolderName] = useState('');
    const [subNoteName, setSubNoteName]= useState('');


    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get('http://localhost:4000/folders');
                dispatch({type: 'SET_FOLDERS', payload: response.data});
            } catch(error) {
                console.error('Error fetching folders: ', error);
            }
        };
        fetchFolders();
    }, [dispatch]);

    async function createFolder(folderName){
        try{
            const response = await axios.post('http://localhost:4000/create-folder', {folderName});
            console.log('Folder created: ',response.data);
            dispatch({type: 'ADD_FOLDER', payload: response.data.folder});
        } catch(error){
            console.error('Error creating folder: ', error.response.data.message);
        }
    }

    async function createNoteForCurrentFolder(title) {
        const cfolder = state.currFolder;
        console.log('hello i am here: ', cfolder._id);
        console.log('title: ',title);
        if(!cfolder || !cfolder._id){
            console.error('No current folder selected or it is missing an ID');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:4000/folders/${cfolder._id}/notes`, {
            title: title,
            content: ''  // Starting with empty content
        });
            console.log('Note created:', response.data);
            const newNoteId = response.data.note._id;
            navigate(`/folders/${cfolder._id}/notes/${newNoteId}`);  // Assuming you have a route to edit notes
        } catch (error) {
            console.error('Error creating note:', error.response.data.message);
        }
}


    async function handleDeleteFolder(folder, fold_id){
        try{
            const response = await axios.delete(`http://localhost:4000/folders/${fold_id}`);
            console.log('Folder deleted: ', response.data.message);
            dispatch({type:'DELETE_FOLDER', payload: fold_id});
        }catch(error){
            console.error('Error deleting folder: ', error.response?.data?.message || error.message);
        }
    }
    function openNewNote(){
        const folderId = state.currFolder._id;
        if(!folderId){
            console.error('No folder current selectedc');
        }
        navigate(`/folders/${folderId}/notes/new?isNew=true`);
    }

   //Similar to componentDidMount and componentDidUpdate:
   useEffect(() => {
     // Update the document title using the browser API
     console.log('Current Folder notes', state.currFolder.notes);
   }, [state.currFolder.notes, state.currFolder]); // Only re-run the effect if count changes
   useEffect(()=>{
    console.log("folders useeffect: ",state.folders)
   },[state.folders]);

    /* To create name for notes*/
    function handleFolder(e){
        //console.log(e.target.value);
        setNewFolderName(e.target.value); 
        console.log(newFolderName);    
    };

    /* To create and display list of notes*/
    function newNoteHandler(){
        //setFolders((prev) => ([...prev,folder]));
       //const newFolder = {name: } 
       
    //dispatch({ type: 'ADD_FOLDER', payload: { name: newFolderName, notes: [] } });

    createFolder(newFolderName);
    setNewFolderName(''); // Reset the input after adding
}

    async function noteHandler(folder){
        console.log("ButtonPressed, foldername: ", folder.folderName);
        //const chosen_folder = state.folders.find((f) => f.name === folder.name);
        //setCurrFolder(chosen_folder);

        console.log('folder selected: ', folder.folderName);
        try{
            const response = await axios.get(`http://localhost:4000/folders/${folder._id}`);
            console.log('Fetched folder data with notes: ',response.data);
            dispatch({type: 'SET_CURR_FOLDER', payload: response.data});
        }catch(error){
            console.error("error fetching folder details: ",error.response.data.message);
        }


//        dispatch({type:'SET_CURR_FOLDER', payload: folder});
    }
    
    const handleShow = ()=>{
       // dispatch({type: 'TOGGLE_SHOW'});
    };

    const handleClose = ()=>{
        dispatch({type: 'TOGGLE_SHOW'});
    };

    function handleSubNoteInputChange(updatedSubNoteName){
        setSubNoteName(updatedSubNoteName);

    }

    function handleSubNoteSave(inputSubNoteName){
    
        if (!inputSubNoteName.trim()) {
            alert('Sub-note name is required.');
            return;
        }
        if (!state.currFolder || !state.currFolder.folderName) {
            alert('No current folder selected.');
            return;
        }
        console.log(inputSubNoteName);
        // dispatch({
        //     type: 'ADD_SUB_NOTE',
        //     folderName: state.currFolder.name,
        //     subNoteName: inputSubNoteName
        // });
        createNoteForCurrentFolder(inputSubNoteName);
        setSubNoteName('');
        //navigate(`/${state.currFolder}/${inputSubNoteName}`)
    }
    async function handleDeleteNote(folderId, noteId){
        try {
            // Make a DELETE request to the backend to remove the note
            const response = await axios.delete(`http://localhost:4000/folders/${folderId}/notes/${noteId}`);
        
            console.log('Note deleted:', response.data.message);
            //const noteToDelete = response.data.note._id;
            //console.log('noteid to delete: ', noteToDelete);
            console.log('noteID; ',noteId);
            // Optionally update local state to reflect the changes, if you're using a reducer or state management
            // Replace 'DELETE_SUB_NOTE' with your appropriate action type or state updating logic
            dispatch({ type: 'DELETE_NOTE', payload: noteId });
        
          } catch (error) {
            console.error('Error deleting note:', error.response?.data?.message || error.message);
          }
    }
    function deleteFolder(fol){
        const fold_id =  state.currFolder._id;
        handleDeleteFolder(fol, fold_id);

    }

    function deleteNoteFromFolder(note){
        const folderId = state.currFolder._id;
        const noteId = note._id;
        if (folderId && noteId) {
            console.log(`Deleting note: ${note.title}, id: ${note._id}`);
            handleDeleteNote(folderId, noteId);
          } else {
            console.error('Invalid folder or note ID.');
          }

    }
    function createNote(){
        // how to create note
        dispatch({type: 'TOGGLE_SHOW'});
        //const noteName = subNoteName;
        //navigate(`/${state.currFolder}/${subNoteName}`)

        // go to 
    };

    function openNote(note){
        const folderId = state.currFolder._id;
    const noteId = note._id;

    // Check if both IDs are available
    if (!folderId || !noteId) {
        console.error('Missing folder or note ID');
        return;
    }

    // Use navigate to redirect to the specific note editing page
    navigate(`/folders/${folderId}/notes/${noteId}`);
    }

    return (
        <div className="container">
            <div className="sidebar">
                <input type="text" onChange={handleFolder} placeholder="New Folder Name" />
                <button onClick={newNoteHandler}>Create Folder</button>
                <ul className='navBar1'>
                    {state.folders && state.folders.map((folder, index) => (
                        <li className='navBar2' key={index}>
                            <button onClick={() => noteHandler(folder)}>
                                {folder.folderName}
                            </button>
                            {/* <button onClick={handleShow}>Create sub folder</button> */}
                            <button onClick={() => deleteFolder(folder)}>Delete Folder</button>
                            <button onClick={createNote}>Create New Note here</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="main-content">
                {state.show && (
                    <SubNoteModalPage
                        show={state.show}
                        handleClose={handleClose}
                        subNoteName={subNoteName}
                        setSubNoteName={setSubNoteName}
                        handleSubNoteSave={handleSubNoteSave}
                    />
                )}
                 <button onClick={openNewNote}>Create New Note</button>
                {state.currFolder && state.currFolder.notes && (
                    <div>
                        <h3>Notes in {state.currFolder.folderName}:</h3>
                        <ul className='sub-note-list'>
                            {state.currFolder.notes.map((note, index) => (
                                <li key={index}>
                                    <button onClick={() => openNote(note)}>Open '{note.title}'</button>
                                    <button onClick={() => deleteNoteFromFolder(note)}>delete Note</button>
                                    {/* <button onClick={createNote}>Create New Note</button> */}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Homepage;
