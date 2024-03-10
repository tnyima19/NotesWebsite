import {useState, useEffect} from 'react';
/*import hamburgerIcon from ''*/

function HomepageLeftBar(){
    const [folders, setFolders] = useState([]);
    const [folder, setFolder] = useState({});
   /* const [openHamburger, setOpenHamburger] = useState(false); /* set default of open hamburger icon to be false*/
    const [currFolder, setCurrFolder] = useState({});
   
   // Similar to componentDidMount and componentDidUpdate:
   useEffect(() => {
     // Update the document title using the browser API
   }, [currFolder]); // Only re-run the effect if count changes


    /* To create name for notes*/
    function handleFolder(e){
        let newName=e.target.value;
        console.log(newName);
        setFolder({name: newName, sub_note: ['subnote1', 'subnote2']});
    }

    /* To create and display list of notes*/
    function newNoteHandler(){
        setFolders((prev) => ([folder, ...prev]));
    }
/*
    function hamburgerButton(){
        setOpenHamburger(!openHamburger);
        console.log('Clicked');
    }
*/
    function noteHandler(folder){
        console.log("ButtonPressed");
        setCurrFolder(folder);
    }
    return(<div>
        <input onChange={handleFolder}>
        </input>
        <button onClick={newNoteHandler}>Create Note</button>
        <ul>
        {folders && folders.map((fol) => {
            return (
            <li key={fol}>
                <button onClick={() => noteHandler(fol)}>
                {fol.name} {/* Assuming fol is an object with a 'name' property */}
                </button>
            </li>
            );
        })}
        </ul>
        
        {/* <button onClick={hamburgerButton}></button>  */}
        {currFolder && currFolder.sub_note && currFolder.sub_note.length > 0 && ( <div>
          <h3>Subfolders in {currFolder.name}:</h3>
          <ul>
            {currFolder.sub_note.map((subfolder, index) => (
              <li key={index}>{subfolder}</li>
            ))}
          </ul>
        </div> )}

    </div>)
}
export default HomepageLeftBar;