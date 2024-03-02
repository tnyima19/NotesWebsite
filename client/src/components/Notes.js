import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Include the Quill CSS

const Notes = () => {
  const editorRef = useRef(null); // Reference to the editor element
  const [content,setContent] = useState('');

  
  useEffect(() => {
    if (editorRef.current) {
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

      // Set initial editor content if value exists    //   if (value) {
      //     editor.clipboard.dangerouslyPasteHTML(value);
      //   }

      // Handle editor content changes
      editor.on('text-change', () => {
        //onChange(editor.root.innerHTML); // Pass HTML content up to parent component
        if (editor){
          console.log('Delta content: ',editor.getText());
         setContent(editor.getText());
        }else{
          console.error('Editor not initialized');
        }
        });
    }
  },[] ); // Re-run effect if `onChange` or `value` changes

  return( 
  <div>
  <div ref={editorRef} />
  </div>
  );
};

export default Notes;