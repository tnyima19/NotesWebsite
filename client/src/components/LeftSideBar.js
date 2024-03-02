import React from 'react';
import { useState } from "react";
import {v4 as uuidv4} from 'uuid';
function LeftSideBar(){
   const [currNote,setCurrNote] = useState('')
   const [listNote,setListNote] = useState([]);
   let currId = 0
   function addcurrNote(){
       let newId = crypto.randomUUID();
       //let item ={id:currId,noteName:'currNote'};
       const object = {id:newId,note:currNote};
       setListNote((prev) => ([object,...prev]));
       console.log(listNote);


   }
   function inputChangeHandler(e){
       console.log(e.target.value);
       setCurrNote(e.target.value);

   }
   return(<div>
       <ul>
       {listNote.map((item) => {
           return (<li className="sidebar-item">{item.note}</li>)
       })}
       {/* <li className="sidebar-item">Hello There</li> */}
       {/* <li className="sidebar-item">How are you</li> */}
       </ul>

    <>
        <input type="text" onChange={inputChangeHandler}></input>
        <button onClick={addcurrNote}>Add Note</button>
    </>
      
   </div>)


{/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
<a className="navbar-brand" href="#">Navbar</a>
<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
 <span className="navbar-toggler-icon"></span>
</button>
<div className="collapse navbar-collapse" id="navbarNavDropdown">
 <ul className="navbar-nav">
   <li className="nav-item dropdown">
     <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
       Notes
     </a>
     <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
       {listNote.map((item) => (
         <li>{item.note}</li>
       ))}
     </ul>
   </li>
   {/* Additional nav items here */}
//   </ul>
//   {/* Input field and button to add new notes */}
//   <form className="form-inline my-2 my-lg-0">
//     <input className="form-control mr-sm-2" type="text" placeholder="New Note" aria-label="Add note" value={currNote} onChange={inputChangeHandler} />
//     <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={addcurrNote}>Add Note</button>
//   </form>
// </div>
// </nav> */}
}
export default LeftSideBar;
