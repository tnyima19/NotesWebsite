import React from 'react';
import Notes from '../components/Notes';
import LeftSideBar from '../components/LeftSideBar';
const NotesViewPage = () => {


 return (
   <div>
       <h1>Notes website</h1>
       <div className='container-fluid'>
         <div className='row'>
         <div className='col-md-3'>
           <LeftSideBar />
         </div>
      


      
     <div className='col-md-9'>
       <Notes />
     </div>
     </div>
     </div>
   </div>
 );
};


export default NotesViewPage;