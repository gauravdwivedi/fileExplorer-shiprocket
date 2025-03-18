
// Redux Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { FileExplorerState } from '../types';

const initialState: FileExplorerState = {
  files: {
    root: {
      id: 'root',
      name: 'Root',
      type: 'folder',
      parentId: null,
      position: { x: 0, y: 0 },
    },
  },
  selectedFileId: null,
  contextMenu: {
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
  },
};

const fileExplorerSlice = createSlice({
  name: 'fileExplorer',
  initialState,
  reducers: {
    showContextMenu: (state, action: PayloadAction<{ x: number; y: number; targetId: string | null }>) => {
      state.contextMenu.visible = true;
      state.contextMenu.x = action.payload.x;
      state.contextMenu.y = action.payload.y;
      state.contextMenu.targetId = action.payload.targetId;
    },
    hideContextMenu: (state) => {
      state.contextMenu.visible = false;
    },
    selectFile: (state, action: PayloadAction<string>) => {
      state.selectedFileId = action.payload;
    },
    createFolder: (state, action: PayloadAction<{ name: string; parentId: string | null; position: { x: number; y: number } }>) => {
      const id = uuidv4();
      state.files[id] = {
        id,
        name: action.payload.name,
        type: 'folder',
        parentId: action.payload.parentId,
        position: action.payload.position,
      };
    },
    deleteFolder: (state, action: PayloadAction<string>) => {
      const folderToDelete = state.files[action.payload];
      if (!folderToDelete || folderToDelete.id === 'root') return;
      
      // Delete the folder and all its children
      const deleteRecursively = (folderId: string) => {
        // Get all direct children
        const childrenIds = Object.values(state.files)
          .filter(file => file.parentId === folderId)
          .map(file => file.id);
        
        // Delete children recursively
        childrenIds.forEach(childId => {
          if (state.files[childId].type === 'folder') {
            deleteRecursively(childId);
          }
          delete state.files[childId];
        });
        
        // Delete the folder itself
        delete state.files[folderId];
      };
      
      deleteRecursively(action.payload);
      
      if (state.selectedFileId === action.payload) {
        state.selectedFileId = null;
      }
    },
    moveFolder: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = action.payload;
      if (state.files[id]) {
        state.files[id].position = position;
      }
    },
    renameFolder: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const { id, newName } = action.payload;
      if (state.files[id]) {
        state.files[id].name = newName;
      }
    },
    duplicateFolder: (state, action: PayloadAction<string>) => {
      const sourceFolderId = action.payload;
      const sourceFolder = state.files[sourceFolderId];
      if (!sourceFolder) return;
      
      // Create a map to track original ID to new ID mapping
      const idMapping: Record<string, string> = {};
      
      // Helper function to duplicate a folder and its contents
      const duplicateRecursively = (originalId: string, newParentId: string | null): string => {
        const original = state.files[originalId];
        const newId = uuidv4();
        idMapping[originalId] = newId;
        
        // Create duplicate with adjusted position
        state.files[newId] = {
          ...original,
          id: newId,
          name: original.id === sourceFolderId ? `${original.name} (Copy)` : original.name,
          parentId: newParentId,
          position: original.id === sourceFolderId 
            ? { x: original.position.x + 20, y: original.position.y + 20 } 
            : { ...original.position },
        };
        
        // Find and duplicate all children
        const children = Object.values(state.files).filter(file => file.parentId === originalId);
        children.forEach(child => {
          duplicateRecursively(child.id, newId);
        });
        
        return newId;
      };
      
      duplicateRecursively(sourceFolderId, sourceFolder.parentId);
    },
    changeParentFolder: (state, action: PayloadAction<{ id: string; newParentId: string | null }>) => {
      const { id, newParentId } = action.payload;
      
      // Don't allow moving to own child or self
      if (id === newParentId) return;
      
      // Check if newParentId is a child of id to prevent circular reference
      let current = newParentId;
      while (current) {
        if (current === id) return; // Circular reference detected
        current = state.files[current]?.parentId || null;
      }
      
      if (state.files[id]) {
        state.files[id].parentId = newParentId;
      }
    },
  },
});

export const { 
  showContextMenu, 
  hideContextMenu, 
  selectFile, 
  createFolder, 
  deleteFolder, 
  moveFolder,
  renameFolder,
  duplicateFolder,
  changeParentFolder
} = fileExplorerSlice.actions;

export default fileExplorerSlice.reducer;