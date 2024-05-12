
import {useState, useRef, useEffect} from 'react';
// import { Modal, Button } from 'react-bootstrap';
function SubNoteModalPage({show, handleClose,subNoteName, setSubNoteName, handleSubNoteSave}){
    const ref = useRef();
    useEffect(()=>{
        if(!show){
            return;
        }
        const dialog = ref.current;
        dialog.showModal();
        return() =>{
          if(dialog.open){
            dialog.close();
          }
          
        };
    },[show])
    //const [subNote,setSubNote] = useState('')
    console.log("show: ",show);
    function handleInputChange(e){
        setSubNoteName(e.target.value);

    }
    function onSave(){
        handleSubNoteSave(subNoteName);
        setSubNoteName('');
    }
    //onHide={handleClose}
    //onClick={handleClose}
    return(<dialog ref={ref} >
    {/* <Modal>
        <Modal.Header closeButton>
          <h1>Modal heading</h1>
        </Modal.Header>
        <Modal.Body>Set SubNote Name</Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
      <h1>SubNote name: </h1>
      <input value={subNoteName}onChange={handleInputChange}></input>
      <button variant="secondary" onClick={handleClose}>Close</button>
      <button variant="primary" onClick={onSave}>Save Changes</button>
      
    </dialog>)
};

export default SubNoteModalPage;