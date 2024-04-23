import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Include the Quill CSS

// I want to send 
const currentDate = new Date();
const Notes = () => {

  const date = (currentDate.getMonth()+1).toString() + "/" + currentDate.getDate().toString()+"/"+ currentDate.getFullYear().toString();
  const editorRef = useRef(null); // Reference to the editor element
  const [content,setContent] = useState('');
  const [title, setTitle] = useState('');
  
  useEffect(() => {
    if (editorRef.current && !editorRef.current.quill) {
      const editor = new Quill(editorRef.current, {
        theme: 'snow', // Specify theme
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ]
        }
      });
      editorRef.current.quill = editor;

      // Set initial editor content if value exists    //   if (value) {
      //     editor.clipboard.dangerouslyPasteHTML(value);
      //   }

      // Handle editor content changes
      editor.on('text-change', () => {
        //onChange(editor.root.innerHTML); // Pass HTML content up to parent component
        if (editor){
          console.log('Delta content: ',editor.getText());
          console.log('type of text: ',typeof editor.getText())
         setContent(editor.getText());
        }else{
          console.error('Editor not initialized');
        }
        });
      
      return ()=>{
        editorRef.current.removeChild(editor.Ref.current.firstChild);// Remove quill
        delete editorRef.current.quill;
      };

    }
  },[]); // Re-run effect if `onChange` or `value` changes

  const postData = async (url = '', data={}) =>{
    try {
      const response = await axios.post(url,data);
      console.log(response.data);
    }catch(error){
      console.error('There was an error: ', error);
    }
  };
  function handleSave(){
    const noteData = {
      title: title,
      content: content
    }
    postData('http://localhost:4000', noteData);

  };

  function handleTitleChange(e){
    console.log(e.target.value);
    setTitle(e.target.value);

  }

  const defaultTitle = `NewNote ${date}`;
  return( 
  <div>
  <h1>Title name:</h1><input type="text" value={title || defaultTitle} onChange={handleTitleChange}></input> 
  <div ref={editorRef} />
  <button onClick={handleSave}>Save</button>
  </div>
  );
};

export default Notes;