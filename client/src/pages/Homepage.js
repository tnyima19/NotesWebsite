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

// var link = document.createElement("link"); // Create a new <link> element
// link.rel = "stylesheet"; // Set the 'rel' attribute to 'stylesheet'
// link.href = "https://fonts.googleapis.com/css?family=Tangerine"; // Set the 'href' attribute to the Google Fonts URL
// document.head.appendChild(link); // Append the <link> element to the document head



function Homepage() { // Define the Homepage component

    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [newFolderName, setNewFolderName] = useState('');
    const [subNoteName, setSubNoteName]= useState('');


   //Similar to componentDidMount and componentDidUpdate:
   useEffect(() => {
     // Update the document title using the browser API
     console.log('Current Folder Sub-notes Updated: ', state.currFolder.sub_notes);
   }, [state.currFolder.sub_notes]); // Only re-run the effect if count changes
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
       
    dispatch({ type: 'ADD_FOLDER', payload: { name: newFolderName, sub_notes: [] } });
    setNewFolderName(''); // Reset the input after adding
}

    function noteHandler(folder){
        console.log("ButtonPressed");
        //const chosen_folder = state.folders.find((f) => f.name === folder.name);
        //setCurrFolder(chosen_folder);
        dispatch({type:'SET_CURR_FOLDER', payload: folder});
    };
    
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
        if (!state.currFolder || !state.currFolder.name) {
            alert('No current folder selected.');
            return;
        }
        console.log(inputSubNoteName);
        dispatch({
            type: 'ADD_SUB_NOTE',
            folderName: state.currFolder.name,
            subNoteName: inputSubNoteName
        });
        setSubNoteName('');
        navigate(`/${state.currFolder}/${inputSubNoteName}`)
    }
    function handleDeleteSubNote(subNote){
        console.log('Deleting subnote: ', subNote);
        dispatch({type:'DELETE_SUB_NOTE',payload: subNote});
    }
    function deleteFolder(fol){
        dispatch({type:'DELETE_FOLDER',payload:fol});

    }
    function createNote(){
        // how to create note
        dispatch({type: 'TOGGLE_SHOW'});
        //const noteName = subNoteName;
        //navigate(`/${state.currFolder}/${subNoteName}`)

        // go to 
    };

    return (
        <div className="container">
            <div className="sidebar">
                <input type="text" onChange={handleFolder} placeholder="New Folder Name" />
                <button onClick={newNoteHandler}>Create Folder</button>
                <ul className='navBar1'>
                    {state.folders && state.folders.map((folder, index) => (
                        <li className='navBar2' key={index}>
                            <button onClick={() => noteHandler(folder)}>
                                {folder.name}
                            </button>
                            <button onClick={handleShow}>Create sub folder</button>
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
                 <button onClick={createNote}>Create New Note</button>
                {state.currFolder && state.currFolder.sub_notes && (
                    <div>
                        <h3>Subfolders in {state.currFolder.name}:</h3>
                        <ul className='sub-note-list'>
                            {state.currFolder.sub_notes.map((subNote, index) => (
                                <li key={index}>
                                    {subNote}
                                    <button onClick={() => handleDeleteSubNote(subNote)}>delete SubNote</button>
                                    <button onClick={createNote}>Create New Note</button>
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
