import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Notes.css';

const Notes = () => {
  const { folderId, noteId, userId } = useParams();
  const { currentUser } = useAuth();
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [searchPrompt, setSearchPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isNew = queryParams.get('isNew') === 'true';

  useEffect(() => {
    const fetchNote = async () => {
      if (!isNew) {
        try {
          const response = await axios.get(`http://localhost:4000/users/${userId}/folders/${folderId}/notes/${noteId}`, {
            headers: { Authorization: await currentUser.getIdToken() }
          });
          const noteData = response.data.note;
          setTitle(noteData.title);
          setContent(noteData.content);

          if (editorRef.current && editorRef.current.quill) {
            editorRef.current.quill.root.innerHTML = noteData.content;
          }
        } catch (error) {
          console.error('Failed to fetch note:', error.response?.data?.message || 'Error occurred');
        }
      } else {
        setTitle('');
        setContent('');
      }
    };

    fetchNote();

    if (editorRef.current && !editorRef.current.quill) {
      const editor = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ]
        }
      });
      editorRef.current.quill = editor;
      editor.on('text-change', () => setContent(editor.root.innerHTML));
    }
  }, [folderId, noteId, isNew, userId, currentUser]);

  const saveNote = async () => {
    try {
      if (isNew) {
        const response = await axios.post(`http://localhost:4000/users/${userId}/folders/${folderId}/notes`, {
          title,
          content
        }, {
          headers: { Authorization: await currentUser.getIdToken() }
        });
        console.log('New note created:', response.data);
        navigate(`/users/${userId}/folders/${folderId}/notes/${response.data.note._id}`);
      } else {
        const response = await axios.put(`http://localhost:4000/users/${userId}/notes/${noteId}`, {
          title,
          content
        }, {
          headers: { Authorization: await currentUser.getIdToken() }
        });
        console.log('Note updated:', response.data);
      }
    } catch (error) {
      console.error('Error saving note:', error.response?.data?.message || 'Error occurred');
    }
  };

  const saveAndReturnHome = () => {
    saveNote();
    navigate(`/users/${userId}/homepage`);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const fetchGeneratedImages = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}/search-images`, {
        headers: {
          Authorization: await currentUser.getIdToken(),
          'Content-Type': 'application/json'
        },
        params: {
          q: searchPrompt
        }
      });
      setGeneratedImages(response.data || []);
    } catch (error) {
      console.error('Error fetching generated images:', error.response?.data?.message || 'Error occurred');
    }
  };

  const handleGenerateImage = async (event) => {
    event.preventDefault();
    fetchGeneratedImages();
  };

  const insertImageInEditor = (imageUrl) => {
    const editor = editorRef.current.quill;
    const range = editor.getSelection();
    const position = range ? range.index : editor.getLength();
    editor.insertEmbed(position, 'image', imageUrl);
  };

  return (
    <div className='notes-container'>
      <div className='editor-container'>
        <h1>Note Title:</h1>
        <input type="text" value={title} onChange={handleTitleChange} />
        <div ref={editorRef} />
        <button onClick={saveNote}>Save Changes</button>
        <button onClick={saveAndReturnHome}>Return Home</button>
      </div>
      <div className="sidebar-container">
        <h2>Generated Images</h2>
        <form onSubmit={handleGenerateImage}>
          <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Enter prompt for image"
          />
          <button type="submit">Search Images</button>
        </form>
        {generatedImages.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <div className="image-results">
            {generatedImages.map((image, index) => (
              <img key={index} src={image.src} alt={`Generated ${index}`} onClick={() => insertImageInEditor(image.src)} style={{ cursor: 'pointer', margin: '5px' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
