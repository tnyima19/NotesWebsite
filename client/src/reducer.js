import ExampleNotes from "./ExampleNotes";
export const initialState = {
    folders: [],
    currFolder:{},
    show:false
  };
export const reducer = (state,action) =>{
    switch(action.type){
      case "SET_FOLDERS":
        return {...state, folders: action.payload};
      case 'ADD_FOLDER':
        return {...state, folders:[...state.folders, action.payload], currFolder: action.payload};
      case 'SET_CURR_FOLDER':
        return {...state, currFolder:action.payload};
      case 'SET_CURR_SUBFOLDER_NAME':
        return {...state, currSubFolderName: action.payload};
      case 'TOGGLE_SHOW':
        return {...state, show: !state.show}
      case 'UPDATE_FOLDERS':
        if (!state.currFolder) return state;  // Early return if currFolder is undefined
        return {
          ...state,
          folders: state.folders.map(folder =>
            folder._id === state.currFolder._id
            ? {...folder, notes: [...folder.notes, action.payload]}
            : folder
          )
        };
      case 'UPDATE_CURR_FOLDER':
        if (!state.currFolder || !state.currFolder.notes) {
          console.error('Current folder or sub_note is undefined');
          return state;  // Return state unmodified if current folder or sub_note is undefined
        }
        return {
            ...state,
            currFolder: {
              ...state.currFolder,
              notes: [...state.currFolder.notes, {name: action.payload}]
            }
        }
      case 'ADD_SUB_NOTE':
        const updatedFolders2 = state.folders.map(folder =>
          folder.name === action.folderName
          ? {...folder, sub_notes: [...folder.sub_notes, action.subNoteName]}
          : folder
        );
        const updatedCurrFolder = updatedFolders2.find(folder => folder.name === state.currFolder.name);
        return {
          ...state,
          folders: updatedFolders2,
          currFolder: updatedCurrFolder || state.currFolder, // ensure currFolder is updated or fallback to existing
        };
      case 'DELETE_FOLDER':
        const uFolders = state.folders.filter(f => f._id !== action.payload._id);
        //const isCurrent = state.currFolder && state.currFolder._id === action.payload._id;
        return {...state, folders: uFolders, currFolder: state.currFolder._id === action.payload ? {}: state.currFolder};
      case 'DELETE_NOTE':
        const updatedNotes = state.currFolder.notes.filter(note => note._id !== action.payload);
        const updatedCurrentFolder  = {...state.currFolder, notes: updatedNotes};

        const updatedFolders =  state.folders.map(folder => folder._id === state.currFolder._id ? {...folder, notes: updatedNotes}: folder);

        return{
          ...state, 
          currFolder:updatedCurrentFolder,
          folders: updatedFolders};// {...state, sub_note: action.payload};
      default:
        return state;
      }
  };

//  export {initialState, reducer}