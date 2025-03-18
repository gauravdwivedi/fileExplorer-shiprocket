// src/components/Folder.tsx
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { selectFile, showContextMenu, changeParentFolder, moveFolder } from '../store/fileExplorerSlice';
import { FolderContainer, FolderIcon, FolderName } from '../styles/StyledComponents';
import { RootState } from '../store';
import { FileItem } from '../types';

interface FolderProps {
  folder: FileItem;
  isOpen?: boolean;
}

const Folder: React.FC<FolderProps> = ({ folder }) => {
  const dispatch = useDispatch();
  const selectedFileId = useSelector((state: RootState) => state.fileExplorer.selectedFileId);
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FOLDER',
    item: { 
      id: folder.id,
      type: 'folder',
      // Include original position for calculating offset
      originalX: folder.position.x,
      originalY: folder.position.y 
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // Add an end drag handler to update the position
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ id: string, isFolder: boolean }>();
      
      // If dropped on a folder, handle parent change
      if (dropResult && dropResult.isFolder && dropResult.id !== item.id) {
        dispatch(changeParentFolder({ id: item.id, newParentId: dropResult.id }));
        return;
      }
      
      // Otherwise, update position if it was a successful drop
      if (monitor.didDrop()) {
        const delta = monitor.getDifferenceFromInitialOffset();
        
        if (delta) {
          const newX = Math.round(item.originalX + delta.x);
          const newY = Math.round(item.originalY + delta.y);
          
          dispatch(moveFolder({
            id: item.id,
            position: { x: newX, y: newY }
          }));
        }
      }
    }
  }), [folder.id, folder.position.x, folder.position.y]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOLDER',
    drop: (item: { id: string }, monitor) => {
      // Return an object that identifies this as a folder drop target
      return { id: folder.id, isFolder: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // Combine drag and drop refs
  const connectRef = (element: HTMLDivElement | null) => {
    drag(element);
    drop(element);
    if (ref.current !== element) {
      ref.current = element;
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(selectFile(folder.id));
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(showContextMenu({
      x: e.clientX,
      y: e.clientY,
      targetId: folder.id,
    }));
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    // Double-click can be used to open folders in a future implementation
    e.stopPropagation();

    console.log('Double CLick')
  };
  
  return (
    <FolderContainer
      ref={connectRef}
      x={folder.position.x}
      y={folder.position.y}
      isSelected={selectedFileId === folder.id}
      style={{ opacity: isDragging ? 0.5 : 1, border: isOver ? '2px dashed blue' : 'none' }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      <FolderIcon />
      <FolderName>{folder.name}</FolderName>
    </FolderContainer>
  );
};

export default Folder;