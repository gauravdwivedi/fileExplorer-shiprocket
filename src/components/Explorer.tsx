// src/components/Explorer.tsx
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { 
  hideContextMenu, 
  selectFile, 
  deleteFolder, 
  showContextMenu,
  moveFolder, 
  changeParentFolder
} from '../store/fileExplorerSlice';
import { ExplorerContainer } from '../styles/StyledComponents';
import { RootState } from '../store';
import Folder from './Folder';
import ContextMenu from './ContextMenu';

const Explorer: React.FC = () => {
  const dispatch = useDispatch();
  const files = useSelector((state: RootState) => state.fileExplorer.files);
  const contextMenu = useSelector((state: RootState) => state.fileExplorer.contextMenu);
  const selectedFileId = useSelector((state: RootState) => state.fileExplorer.selectedFileId);
  const explorerRef = useRef<HTMLDivElement>(null);
  
  // Current view shows folders at the root level
  const rootFolders = Object.values(files).filter(file => file.parentId === null);
  
  // Make the explorer a drop target
  const [, drop] = useDrop(() => ({
    accept: 'FOLDER',
    drop: (item: { id: string, originalX: number, originalY: number }, monitor) => {
      if (monitor.didDrop()) {
        // Don't handle the drop if a child component handled it
        return;
      }
      
      // Calculate the new position
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = Math.round(item.originalX + delta.x);
        const newY = Math.round(item.originalY + delta.y);
        
        // Update the folder position
        dispatch(moveFolder({
          id: item.id,
          position: { x: newX, y: newY }
        }));
        
        // When dropped on the explorer (not a folder), ensure parentId is null
        if (files[item.id]?.parentId !== null) {
          dispatch(changeParentFolder({ id: item.id, newParentId: null }));
        }
      }
      
      return { id: 'explorer', isFolder: false };
    }
  }), []);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(showContextMenu({
      x: e.clientX,
      y: e.clientY,
      targetId: null,
    }));
  };
  
  const handleClick = () => {
    if (contextMenu.visible) {
      dispatch(hideContextMenu());
    } else if (selectedFileId) {
      dispatch(selectFile(''));
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedFileId && selectedFileId !== 'root') {
      dispatch(deleteFolder(selectedFileId));
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFileId]);
  
  // Connect the drop ref to the explorer container
  const connectRef = (element: HTMLDivElement | null) => {
    drop(element);
    if (explorerRef.current !== element) {
      explorerRef.current = element;
    }
  };
  
  return (
    <ExplorerContainer 
      ref={connectRef}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {rootFolders.map(folder => (
        <Folder key={folder.id} folder={folder} />
      ))}
      <ContextMenu />
    </ExplorerContainer>
  );
};

export default Explorer;