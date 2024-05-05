import ExampleNotes from "./ExampleNotes";
export const initialState = {
    folders: ExampleNotes,
    folder:{},
    currFolder:{},
    currSubFolderName:'',
    show:false
  };
export const reducer = (state,action) =>{
    switch(action.type){
      case "SET_FOLDER":
        return {...state, folder:action.payload};
      case 'ADD_FOLDER':
        return {...state, folders:[...state.folders, action.payload]};
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
            folder.name === state.currFolder.name
            ? {...folder, sub_notes: [...(folder.sub_notes || []), {name: action.payload}]}
            : folder
          )
        };
      case 'UPDATE_CURR_FOLDER':
        if (!state.currFolder || !state.currFolder.sub_note) {
          console.error('Current folder or sub_note is undefined');
          return state;  // Return state unmodified if current folder or sub_note is undefined
        }
        return {
            ...state,
            currFolder: {
              ...state.currFolder,
              sub_notes: [...state.currFolder.sub_notes, {name: action.payload}]
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
        const uFolders = state.folders.filter(f => f.name !== action.payload.name);
        const isCurrent = state.currFolder && state.currFolder.name === action.payload.name;
        return {...state, folders: uFolders, currFolder: isCurrent ? {}: state.currFolder};
      case 'DELETE_SUB_NOTE':
        const updatedFolders = state.folders.map(folder =>{
          if (folder.name === state.currFolder.name){
            const filteredSubNotes = folder.sub_notes.filter(sub => sub !== action.payload);
            return {...folder, sub_notes: filteredSubNotes};
          }
          return folder;
        });
        return {...state,
           folders: updatedFolders,
           currFolder:{...state.currFolder, sub_notes: state.currFolder.sub_notes.filter(sub => sub !== action.payload)
          }};
      //return {...state, sub_note: action.payload};
      default:
        return state;
      }
  };

//  export {initialState, reducer}