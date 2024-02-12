import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Include the Quill CSS

const Notes = () => {
  const editorRef = useRef(null); // Reference to the editor element

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

      // Set initial editor content if value exists
    //   if (value) {
    //     editor.clipboard.dangerouslyPasteHTML(value);
    //   }

      // Handle editor content changes
    //   editor.on('text-change', () => {
    //     onChange(editor.root.innerHTML); // Pass HTML content up to parent component
    //   });
    }
  }, ); // Re-run effect if `onChange` or `value` changes

  return <div ref={editorRef} />;
};

export default Notes;