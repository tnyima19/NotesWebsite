// Homepage.js
import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import SubNoteModalPage from './SubNoteModalPage';
import HomepageLeftBar from "../components/HomepageLeftBar";
import TrashButton from "../components/TrashButton";
import hamBurgerMenuImg from '../pages/hamburger-menu-5.png';
import ThemeButton from "../components/ThemeButton";
import '../pages/Homepage.css';
import { reducer, initialState } from '../reducer';
import axios from 'axios';

function Homepage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newFolderName, setNewFolderName] = useState('');
  const [subNoteName, setSubNoteName] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/folders');
        dispatch({ type: 'SET_FOLDERS', payload: response.data });
      } catch (error) {
        console.error('Error fetching folders: ', error);
      }
    };
    fetchFolders();
  }, [dispatch]);

  async function createFolder(folderName) {
    try {
      const response = await axios.post('http://localhost:4000/create-folder', { folderName });
      console.log('Folder created: ', response.data);
      dispatch({ type: 'ADD_FOLDER', payload: response.data.folder });
    } catch (error) {
      console.error('Error creating folder: ', error.response.data.message);
    }
  }

  async function createNoteForCurrentFolder(title) {
    const cfolder = state.currFolder;
    console.log('hello i am here: ', cfolder._id);
    console.log('title: ', title);
    if (!cfolder || !cfolder._id) {
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
      navigate(`/folders/${cfolder._id}/notes/${newNoteId}`);
    } catch (error) {
      console.error('Error creating note:', error.response.data.message);
    }
  }

  async function handleDeleteFolder(folderId) {
    try {
      const response = await axios.delete(`http://localhost:4000/folders/${folderId}`);
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
    navigate(`/folders/${folderId}/notes/new?isNew=true`);
  }

  useEffect(() => {
    console.log('Current Folder notes', state.currFolder.notes);
  }, [state.currFolder.notes, state.currFolder]);

  useEffect(() => {
    console.log("folders useEffect: ", state.folders);
  }, [state.folders]);

  function handleFolder(e) {
    setNewFolderName(e.target.value);
    console.log(newFolderName);
  }

  async function noteHandler(folder) {
    console.log("ButtonPressed, foldername: ", folder.folderName);
    console.log('folder selected: ', folder.folderName);
    try {
      const response = await axios.get(`http://localhost:4000/folders/${folder._id}`);
      console.log('Fetched folder data with notes: ', response.data);
      dispatch({ type: 'SET_CURR_FOLDER', payload: response.data });
    } catch (error) {
      console.error("error fetching folder details: ", error.response.data.message);
    }
  }

  async function handleDeleteNote(folderId, noteId) {
    try {
      const response = await axios.delete(`http://localhost:4000/folders/${folderId}/notes/${noteId}`);
      console.log('Note deleted:', response.data.message);
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
      console.log(`Deleting note: ${note.title}, id: ${note._id}`);
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
    navigate(`/folders/${folderId}/notes/${noteId}`);
  }

  function handleSubNoteInputChange(updatedSubNoteName) {
    setSubNoteName(updatedSubNoteName);
  }

  function handleSubNoteSave(inputSubNoteName) {
    if (!inputSubNoteName.trim()) {
      alert('Sub-note name is required.');
      return;
    }
    if (!state.currFolder || !state.currFolder.folderName) {
      alert('No current folder selected.');
      return;
    }
    createNoteForCurrentFolder(inputSubNoteName);
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
      <div className="sidebar">
        <input type="text" onChange={handleFolder} placeholder="New Folder Name" />
        <button onClick={newNoteHandler}>Create Folder</button>
        <ul className='navBar1'>
          {state.folders && state.folders.map((folder, index) => (
            <li className='navBar2' key={index}>
              <button onClick={() => noteHandler(folder)}>
                {folder.folderName}
              </button>
              <button onClick={() => deleteFolder(folder)}>Delete Folder</button>
              <button onClick={createNote}>Create New Note here</button>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout}>Logout</button>
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
        <button onClick={openNewNote}>Create New Note</button>
        {state.currFolder && state.currFolder.notes && (
          <div>
            <h3>Notes in {state.currFolder.folderName}:</h3>
            <ul className='sub-note-list'>
              {state.currFolder.notes.map((note, index) => (
                <li key={index}>
                  <button onClick={() => openNote(note)}>Open '{note.title}'</button>
                  <button onClick={() => deleteNoteFromFolder(note)}>Delete Note</button>
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
