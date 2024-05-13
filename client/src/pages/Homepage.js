import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import SubNoteModalPage from './SubNoteModalPage';
import HomepageLeftBar from "../components/HomepageLeftBar";
import TrashButton from "../components/TrashButton";
import hamBurgerMenuImg from '../pages/hamburger-menu-5.png';
import ThemeButton from "../components/ThemeButton";
import '../pages/Homepage1.css'; // Use Priya's updated CSS
import folderIcon from '../components/folder-removebg-preview.png';
import trashIcon from '../components/trash-icon.png';
import { reducer, initialState } from '../reducer';
import axios from 'axios';

// Add Google Fonts link
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css?family=Tangerine";
document.head.appendChild(link);

function Homepage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newFolderName, setNewFolderName] = useState('');
  const [subNoteName, setSubNoteName] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/${userId}/folders`, {
          headers: { Authorization: await currentUser.getIdToken() }
        });
        dispatch({ type: 'SET_FOLDERS', payload: response.data });
      } catch (error) {
        console.error('Error fetching folders: ', error);
      }
    };
    fetchFolders();
  }, [dispatch, userId, currentUser]);

  async function createFolder(folderName) {
    try {
      const response = await axios.post(`http://localhost:4000/users/${userId}/folders`, { folderName }, {
        headers: { Authorization: await currentUser.getIdToken() }
      });
      console.log('Folder created: ', response.data);
      dispatch({ type: 'ADD_FOLDER', payload: response.data.folder });
    } catch (error) {
      console.error('Error creating folder: ', error.response?.data?.message || error.message);
    }
  }

  async function createNoteForCurrentFolder(title) {
    const cfolder = state.currFolder;
    if (!cfolder || !cfolder._id) {
      console.error('No current folder selected or it is missing an ID');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/users/${userId}/folders/${cfolder._id}/notes`, {
        title: title,
        content: ''  // Starting with empty content
      }, {
        headers: { Authorization: await currentUser.getIdToken() }
      });
      console.log('Note created:', response.data);
      const newNoteId = response.data.note._id;
      navigate(`/users/${userId}/folders/${cfolder._id}/notes/${newNoteId}`);
    } catch (error) {
      console.error('Error creating note:', error.response.data.message);
    }
  }

  async function handleDeleteFolder(folderId) {
    try {
      const response = await axios.delete(`http://localhost:4000/users/${userId}/folders/${folderId}`, {
        headers: { Authorization: await currentUser.getIdToken() }
      });
      console.log('Folder deleted: ', response.data.message);
      dispatch({ type: 'DELETE_FOLDER', payload: folderId });
    } catch (error) {
      console.error('Error deleting folder: ', error.response?.data?.message || error.message);
    }
  }

  function openNewNote() {
    const folderId = state.currFolder._id;
    if (!folderId) {
      console.error('No folder currently selected');
    }
    navigate(`/users/${userId}/folders/${folderId}/notes/new?isNew=true`);
  }

  useEffect(() => {
    console.log('Current Folder notes', state.currFolder.notes);
  }, [state.currFolder.notes, state.currFolder]);

  useEffect(() => {
    console.log("folders useEffect: ", state.folders);
  }, [state.folders]);

  function handleFolder(e) {
    setNewFolderName(e.target.value);
  }

  async function noteHandler(folder) {
    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}/folders/${folder._id}`, {
        headers: { Authorization: await currentUser.getIdToken() }
      });
      dispatch({ type: 'SET_CURR_FOLDER', payload: response.data });
    } catch (error) {
      console.error("Error fetching folder details: ", error.response.data.message);
    }
  }

  async function handleDeleteNote(folderId, noteId) {
    try {
      const response = await axios.delete(`http://localhost:4000/users/${userId}/folders/${folderId}/notes/${noteId}`, {
        headers: { Authorization: await currentUser.getIdToken() }
      });
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
    } catch (error) {
      console.error('Error deleting note:', error.response?.data?.message || error.message);
    }
  }

  function deleteFolder(folder) {
    handleDeleteFolder(folder._id);
  }

  function deleteNoteFromFolder(note) {
    const folderId = state.currFolder._id;
    const noteId = note._id;
    if (folderId && noteId) {
      handleDeleteNote(folderId, noteId);
    } else {
      console.error('Invalid folder or note ID.');
    }
  }

  function createNote() {
    dispatch({ type: 'TOGGLE_SHOW' });
  }

  function openNote(note) {
    const folderId = state.currFolder._id;
    const noteId = note._id;
    if (!folderId || !noteId) {
      console.error('Missing folder or note ID');
      return;
    }
    navigate(`/users/${userId}/folders/${folderId}/notes/${noteId}`);
  }

  function handleSubNoteInputChange(updatedSubNoteName) {
    setSubNoteName(updatedSubNoteName);
  }

  function handleSubNoteSave() {
    if (!subNoteName.trim()) {
      alert('Sub-note name is required.');
      return;
    }
    if (!state.currFolder || !state.currFolder.folderName) {
      alert('No current folder selected.');
      return;
    }
    createNoteForCurrentFolder(subNoteName);
    setSubNoteName('');
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  }

  async function newNoteHandler() {
    if (newFolderName.trim() === '') {
      alert('Folder name is required.');
      return;
    }
    await createFolder(newFolderName);
    setNewFolderName('');
  }

  return (
    <div className="container">
      <div>
        <h1 id="header">NoteScape <span style={{ fontSize: '27px' }}>&nbsp; &#128221;</span></h1>
      </div>

      <div className="sidebar">
        <div className="folder">
          <input type="text" onChange={handleFolder} placeholder="Enter name" />
          <button className="create-folder" onClick={newNoteHandler}>Create Folder</button>
        </div>

        <ul className='navBar1'>
          {state.folders && state.folders.map((folder, index) => (
            <li className='navBar2' key={index}>
              <div className="folderFix">
                <div className="folder-icon" onClick={() => noteHandler(folder)}>
                  <img src={folderIcon} height="110" alt="folder" />
                  <span className="folder-name"> {folder.folderName}</span>
                </div>
                <div className="delete-folder">
                  <img className="delete-folder-button" src={trashIcon} alt="Delete" height="24" onClick={() => deleteFolder(folder)} title="Delete Folder"/>
                </div>
              </div>
              <button id="create-note-folder" onClick={createNote}>Create a New Note</button>
            </li>
          ))}
        </ul>
        <button id="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="main-content">
        {state.show && (
          <SubNoteModalPage
            show={state.show}
            handleClose={() => dispatch({ type: 'TOGGLE_SHOW' })}
            subNoteName={subNoteName}
            setSubNoteName={setSubNoteName}
            handleSubNoteSave={handleSubNoteSave}
          />
        )}
        <div className="general-note">
          <button id="general-note-btn" onClick={openNewNote}>Create New Note</button>
        </div>
        {state.currFolder && state.currFolder.notes && (
          <div>
            <h3 id="header2">Notes in {state.currFolder.folderName}:</h3>
            <ul className='sub-note-list'>
              {state.currFolder.notes.map((note, index) => (
                <li key={index}>
                  <button id="open-btn" onClick={() => openNote(note)}>Open '{note.title}'</button>
                  <button id="delete-btn" onClick={() => deleteNoteFromFolder(note)}>Delete Note</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ThemeButton />
    </div>
  );
}

export default Homepage;
