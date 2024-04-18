import React, { useState, useEffect } from 'react'; // Import React and its hooks for state and side effects. 
//This line imports the React library and two hooks, useState and useEffect, from the React package. 
//These hooks are essential for managing state and performing side effects in functional components.

import HomepageLeftBar from "../components/HomepageLeftBar"; // Import the HomepageLeftBar component
import TrashButton from "../components/TrashButton"; // Import the TrashButton component
import hamBurgerMenuImg from '../pages/hamburger-menu-5.png'; // Import the the hamburger menu image
import ThemeButton from "../components/ThemeButton"; // Import the ThemeButton component
import '../pages/Homepage.css'; // Import the Homepage CSS file

var link = document.createElement("link"); // Create a new <link> element
link.rel = "stylesheet"; // Set the 'rel' attribute to 'stylesheet'
link.href = "https://fonts.googleapis.com/css?family=Tangerine"; // Set the 'href' attribute to the Google Fonts URL
document.head.appendChild(link); // Append the <link> element to the document head

function Homepage() { // Define the Homepage component

    //This line initializes state for controlling the visibility of the navigation menu. 
    //The showNav variable holds the current state value, and setShowNav is a function used to update this state.
    const [showNav, setShowNav] = useState(false); // Declare state for showing/hiding the navigation
    
   //This line initializes state for storing the list of folders displayed in the navigation menu. 
   //The folders variable holds the current state value, and setFolders is a function used to update this state.
    const [folders, setFolders] = useState([]);  // Declare state for storing folders
    
    //This line initializes state for tracking the currently selected folder. The selectedFolder 
    //variable holds the current state value, and setSelectedFolder is a function used to update this state.
    const [selectedFolder, setSelectedFolder] = useState(null); // Declare state for the selected folder

    //This is a side effect hook that runs when the component mounts. It's used to load the list of folders 
    //from local storage into the folders state variable.
    useEffect(() => {
        const storedFolders = JSON.parse(localStorage.getItem('folders')); // Get folders from local storage
        if (storedFolders) { // If folders exist in local storage
            setFolders(storedFolders); // Set the folders state
        }
    }, []);

    //This function adds a new folder to the list of folders. It updates both the folders state variable 
    //and the local storage with the new folder data.
    const addFolder = (newFolder) => {
        setFolders([...folders, newFolder]); // Add the new folder to the folders state
        localStorage.setItem('folders', JSON.stringify([...folders, newFolder])); // Update local storage with the new folders
    };

    const toggleNav = () => { // Function to toggle the navigation visibility
        setShowNav(!showNav); // Toggle the showNav state
    };

    return ( // Render the JSX markup
        <div>
            <img id="ham" src={hamBurgerMenuImg} height="33" alt="hamburger menu img" onClick={toggleNav} />
            <h1 id="header">NoteScape <span style={{ fontSize: '27px' }}>&nbsp; &#128221;</span></h1>
            <nav className={`side-nav ${showNav ? 'show' : ''}`}>
                <ul className='navBar1'>
                    {folders.map((folder, index) => (
                        <li className="navBar2" key={index} onClick={() => setSelectedFolder(folder)}>
                            {selectedFolder === folder ? '▼ ' : '> '}{folder.name}
                            {selectedFolder === folder && folder.sub_note && folder.sub_note.length > 0 && (
                                <ul className="sub-note-list">
                                    {folder.sub_note.map((subfolder, index) => (
                                        <li key={index}>{subfolder}</li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
                <button className="close-btn" onClick={toggleNav}>x</button>
            </nav>
            <div className={`main-content ${showNav ? 'pushed' : ''}`}>
                <HomepageLeftBar addFolder={addFolder} setSelectedFolder={setSelectedFolder} />
                <TrashButton folders={folders} setFolders={setFolders} setSelectedFolder={setSelectedFolder} />
                <ThemeButton />
            </div>
        </div>
    );
}

export default Homepage;
