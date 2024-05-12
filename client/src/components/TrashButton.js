import React, { useState } from 'react';
import trashIcon from '../components/trash-icon.png';

function TrashButton({ folders, setFolders, setSelectedFolder }) {
    // State variables to manage the state of the trash menu and the selected folder to delete
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedFolder, setSelectedFolderToDelete] = useState(null);

    // Function to handle the deletion of a folder
    const handleDeleteFolder = () => {
        // Function to handle the deletion of a folder
        if (selectedFolder) {
            // Filter out the selected folder from the list of folders
            const updatedFolders = folders.filter(folder => folder !== selectedFolder);
            // Update the folders state with the filtered list
            setFolders(updatedFolders); // Clear the selected folder state variables
            setSelectedFolder(null); // Clear selected folder if it's deleted
            setSelectedFolderToDelete(null); // Clear selected folder to delete
            localStorage.setItem('folders', JSON.stringify(updatedFolders));
        }
        setMenuOpen(false); // Close the menu after deleting folder
    };

    return (
        <div className="trash-menu">
            <img
                src={trashIcon}
                alt="Trash"
                height="28"
                onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
                <div className="folder-menu">
                    {folders.map((folder, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                id={`folder_${index}`}
                                name="folders"
                                value={folder.name}
                                checked={selectedFolder === folder}
                                onChange={() => setSelectedFolderToDelete(folder)}
                            />
                            <label htmlFor={`folder_${index}`}>{folder.name}</label>
                        </div>
                    ))}
                    <button id="trashButton" onClick={handleDeleteFolder}>Delete Folder</button>
                </div>
            )}
        </div>
    );
}

export default TrashButton;


/*
The TrashButton component renders a trash icon that, when clicked, toggles the 
visibility of a folder menu. It maintains state variables (menuOpen and selectedFolder) 
using the useState hook to manage the menu visibility and the selected folder to delete.
The handleDeleteFolder function is called when the delete button in the folder menu is 
clicked. It filters out the selected folder from the list of folders, updates the state 
and local storage, and closes the menu. The folder menu is conditionally rendered based on 
the menuOpen state. It contains radio buttons to select a folder and a delete button to 
delete the selected folder. Each folder in the menu is rendered with an input radio button 
and a corresponding label to display the folder name. The checked attribute of the radio 
button is controlled by comparing the selectedFolder state with the current folder being iterated.
The onChange event of the radio button updates the selectedFolder state when a 
different folder is selected.
*/

/*

A radio button, also known as a radio input or option button, 
is a graphical control element that allows users to select one option 
from a set of mutually exclusive choices. Unlike checkboxes, which allow 
multiple selections, radio buttons are designed to only allow a single selection 
at a time within a group of options.
*/