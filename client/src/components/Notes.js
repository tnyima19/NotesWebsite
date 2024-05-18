import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Notes.css';
const Notes = ({ folderId, noteId }) => {
    const editorRef = useRef(null);
    const [content, setContent] = useState('');
    const [imageURL, setGeneratedImages]=useState('');
    const [title, setTitle] = useState('');
    const [searchPrompt, setSearchPrompt] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract query parameters
    const queryParams = new URLSearchParams(location.search);
    const isNew = queryParams.get('isNew') === 'true';
    const newTitle = queryParams.get('title');

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/folders/${folderId}/notes/${noteId}`);
                const noteData = response.data.note;
                setTitle(noteData.title);
                setContent(noteData.content);

                // Load existing content into the Quill editor
                if (editorRef.current && editorRef.current.quill) {
                    editorRef.current.quill.root.innerHTML = noteData.content;
                }
            } catch (error) {
                console.error('Failed to fetch note:', error.response?.data?.message || 'Error occurred');
            }
        };

        // If it's not a new note, fetch the note data
        if (!isNew) fetchNote();

        // Initialize the Quill editor
        if (editorRef.current && !editorRef.current.quill) {
            const editor = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block']
                    ]
                }
            });
            editorRef.current.quill = editor;
            editor.on('text-change', () => setContent(editor.root.innerHTML));

            // If it's a new note, set the title to the provided value
            if (isNew && newTitle) {
                setTitle(newTitle);
                editor.root.innerHTML = '';
            }
        }
    }, [folderId, noteId, isNew, newTitle]);

    const saveNote = async () => {
        try {
            if (isNew) {
                // Create a new note
                const response = await axios.post(`http://localhost:4000/folders/${folderId}/notes`, {
                    title,
                    content
                });
                console.log('New note created:', response.data);
            } else {
                // Update an existing note
                const response = await axios.put(`http://localhost:4001/notes/${noteId}`, {
                    title,
                    content
                });
                console.log('Note updated:', response.data);
            }
        } catch (error) {
            console.error('Error saving note:', error.response?.data?.message || 'Error occurred');
        }
    };

    function saveAndReturnHome() {
        saveNote();
        navigate('/');
    }

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

  //   const fetchGeneratedImages = async () => {
  //     try {
  //         const response = await axios.get(`http://localhost:4001/get-images`);
  //         setGeneratedImages(response.data[0]. || []);
  //     } catch (error) {
  //         console.error('Error fetching generated images:', error.response?.data?.message || 'Error occurred');
  //     }
  // };

  // useEffect(()=>{
  //   fetchGeneratedImages();
  // },[]);


  const handleGenerateImage = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post(`http://localhost:4001/create-image`, { u_prompt: searchPrompt });
        //const newImageUrl = response.data.imageUrl;
        console.log('search: ',searchPrompt);
        setGeneratedImages(response.data);
        console.log('url: ',response);
        setSearchPrompt(''); // Reset the prompt input after submission
    } catch (error) {
        console.error('Error generating image:', error.response?.data?.message || 'Error occurred');
    }
};

    return (
        <div className='notes-container'>
          <div className='editor-container'>
          <h1>Note Title:</h1>
            <input type="text" value={title} onChange={handleTitleChange}></input>
            <div ref={editorRef} />
            <button onClick={saveNote}>Save</button>
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
                    <button type="submit">Generate</button>
                </form>
                {/* {generatedImages.length === 0 ? (
                    <p>No images generated yet.</p>
                ) : (
                    generatedImages.map((image, index) => (
                        <img key={index} src={image} alt={`Generated ${index}`} />
                    ))
                )} */}
                {imageURL && <img src={imageURL} alt="prompt" />}
            </div>
        </div>
    );
};

export default Notes;