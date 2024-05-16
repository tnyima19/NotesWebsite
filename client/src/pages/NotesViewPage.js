
import React from 'react';
import { useParams } from 'react-router-dom';
import Notes from '../components/Notes';
import LeftSideBar from '../components/LeftSideBar';
const NotesViewPage = () => {
  const {folderId, noteId}= useParams();

 return (
   <div>
       <h1>NoteScape</h1>
       <div className='container-fluid'>
         <div className='row'>
         <div className='col-md-3'>
           {/* <LeftSideBar /> */}
         </div>
     <div className='col-md-9'>
       <Notes folderId={folderId} noteId={noteId} />
     </div>
     </div>
     </div>
   </div>
 );
};


export default NotesViewPage;