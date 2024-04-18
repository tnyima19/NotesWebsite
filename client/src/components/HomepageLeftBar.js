import { useState, useEffect } from 'react';
import folderIcon from '../components/folder-removebg-preview.png';

function HomepageLeftBar({ addFolder, setSelectedFolder }) {
    //folders: Represents the list of folders.
    const [folders, setFolders] = useState([]); // Define state variable 'folders' to manage the list of folders, initialized as an empty array
    //folderName: Represents the name of the folder being entered by the user.
    const [folderName, setFolderName] = useState(''); // Define state variable 'folderName' to manage the name of the new folder being created, initialized as an empty string
    //currFolder: Represents the currently selected folder.
    const [currFolder, setCurrFolder] = useState(null); // Define state variable 'currFolder' to track the currently selected folder, initialized as null


    //localStorage is a web API that allows saving key-value pairs in a web browser with no expiration time.
    //When working with local storage in web browsers, you can only store strings. 
    //This means that if you want to store JavaScript objects or arrays, you need to convert them into strings first.
    //So, when storing data in local storage, you use JSON.stringify() to convert your JavaScript objects or 
    //arrays into JSON strings before storing them. And when retrieving data from local storage, 
    //you use JSON.parse() to convert the JSON strings back into JavaScript objects or arrays.
    useEffect(() => {
        // Converts a JSON string into a JavaScript object. The stored folders are likely stored 
        //as a JSON string, so JSON.parse() is used to convert them back into an array of folder objects.
        const storedFolders = JSON.parse(localStorage.getItem('folders')); // Retrieve folders from local storage and parse the JSON string
        if (storedFolders) {
            setFolders(storedFolders);
        }
    }, []);

    //Updates the folderName state based on the input value entered by the user.
    const handleFolder = (e) => {
        setFolderName(e.target.value);
    };

    //Creates a new folder object with the entered name and adds it to the list of folders. 
    //It also updates the local storage with the updated list of folders.
    const newNoteHandler = () => {
        const newFolder = { name: folderName, sub_note: ['subnote1', 'subnote2'] };
        const updatedFolders = [newFolder, ...folders];
        setFolders(updatedFolders);
        addFolder(newFolder);
        setFolderName('');
        localStorage.setItem('folders', JSON.stringify(updatedFolders));  //is a method that converts a JavaScript object 
        //or value into a JSON string. In this component, it's used to convert the array of folder objects 
        //into a JSON string before storing it in local storage.
    };

    function toggleFolder(folder) {
        setCurrFolder(currFolder === folder ? null : folder);
        setSelectedFolder(folder);
    }

    return (
        <div>
            <div className="create-btn-container">
                <input onChange={handleFolder} value={folderName} placeholder='Enter name'/>
                <button className="create-btn" onClick={newNoteHandler}>Create Folder</button>
            </div>
            <ul className="horizontal-list">
                {folders && folders.map((fol, index) => (
                    <li className="list" key={fol.name}>
                        <div className="folder-item" onClick={() => toggleFolder(fol)}>
                            <img src={folderIcon} height="120" alt="folder" />
                            <span className="folder-name">{fol.name}</span>
                        </div>
                    </li>
                ))}
            </ul>

            

            {currFolder && (
                <div className='subFolderList'>
                    <h3 className="subHeader">SubFolders/Notes in {currFolder.name}:</h3>
                    <ul>
                        {currFolder.sub_note.map((subfolder, index) => (
                            <li key={index}>{subfolder}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default HomepageLeftBar;
