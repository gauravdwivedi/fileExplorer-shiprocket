
// React Components
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';
import { deleteFolder, hideContextMenu, duplicateFolder, createFolder, renameFolder } from '../store/fileExplorerSlice';

// Styled Components
const ExplorerContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  overflow: hidden;
`;

const FolderContainer = styled.div<{ x: number; y: number; isSelected: boolean }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${props => props.isSelected ? '#e3e3ff' : 'transparent'};
  &:hover {
    background-color: ${props => props.isSelected ? '#e3e3ff' : '#f0f0f0'};
  }
`;

const FolderIcon = styled.div`
  width: 50px;
  height: 40px;
  background-color: #ffd700;
  border-radius: 5px 5px 0 0;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 10px;
    background-color: #ffd700;
    top: -7px;
    left: 5px;
    border-radius: 5px 5px 0 0;
  }
`;

const FolderName = styled.div`
  margin-top: 5px;
  font-size: 12px;
  text-align: center;
  word-break: break-word;
  max-width: 90px;
  height: 40px;
  overflow: hidden;
`;

const ContextMenuComponent = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 8px 15px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #ccc;
  margin: 5px 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4a90e2;
  color: white;
  &:hover {
    background-color: #3a80d2;
  }
`;

const CancelButton = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #bbb;
  }
`;

// Context Menu Component
const ContextMenu: React.FC = () => {
  const dispatch = useDispatch();
  const contextMenu = useSelector((state: RootState) => state.fileExplorer.contextMenu);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  
//   if (!contextMenu.visible) return null;
if (!contextMenu.visible && !showCreateModal && !showRenameModal) return null;

  
  
  const handleCreateFolder = () => { 
    console.log(showCreateModal,'Show Create Modal')
    setShowCreateModal(true);
    setFolderName('');
  };
  
  const handleDeleteFolder = () => {
    if (contextMenu.targetId) {
      dispatch(deleteFolder(contextMenu.targetId));
    }
    dispatch(hideContextMenu());
  };
  
  const handleRenameFolder = () => {
    if (contextMenu.targetId) {
      const folder = useSelector((state: RootState) => 
        state.fileExplorer.files[contextMenu.targetId as string]
      );
      setFolderName(folder?.name || '');
      setShowRenameModal(true);
    }
  };
  
  const handleDuplicateFolder = () => {
    if (contextMenu.targetId) {
      dispatch(duplicateFolder(contextMenu.targetId));
    }
    dispatch(hideContextMenu());
  };
  
  const submitCreateFolder = () => { 
    if (folderName.trim()) {
      dispatch(createFolder({
        name: folderName.trim(),
        parentId: contextMenu.targetId,
        position: { x: contextMenu.x, y: contextMenu.y }
      }));
      setShowCreateModal(false);
      dispatch(hideContextMenu());


    }
  };
  
  const submitRenameFolder = () => {
    if (folderName.trim() && contextMenu.targetId) {
      dispatch(renameFolder({
        id: contextMenu.targetId,
        newName: folderName.trim()
      }));
      setShowRenameModal(false);
      dispatch(hideContextMenu());
    }
  };
  
  const cancelModal = () => {
    setShowCreateModal(false);
    setShowRenameModal(false);
    dispatch(hideContextMenu());
  };
  
  return (
    <>
      <ContextMenuComponent x={contextMenu.x} y={contextMenu.y}>
        <MenuItem onClick={handleCreateFolder}>Create New Folder</MenuItem>
        {contextMenu.targetId && contextMenu.targetId !== 'root' && (
          <>
            <Divider />
            <MenuItem onClick={handleRenameFolder}>Rename</MenuItem>
            <MenuItem onClick={handleDuplicateFolder}>Duplicate</MenuItem>
            <MenuItem onClick={handleDeleteFolder}>Delete</MenuItem>
          </>
        )}
      </ContextMenuComponent>
      
      {showCreateModal && (
        <ModalOverlay onClick={cancelModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Create New Folder</h3>
            <Input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
            />
            <ButtonGroup>
              <CancelButton onClick={cancelModal}>Cancel</CancelButton>
              <Button onClick={submitCreateFolder}>Create</Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {showRenameModal && (
        <ModalOverlay onClick={cancelModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Rename Folder</h3>
            <Input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
            />
            <ButtonGroup>
              <CancelButton onClick={cancelModal}>Cancel</CancelButton>
              <Button onClick={submitRenameFolder}>Rename</Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ContextMenu;
