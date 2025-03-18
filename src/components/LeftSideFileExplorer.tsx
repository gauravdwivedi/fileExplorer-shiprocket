// src/components/LeftSideExplorer.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectFile } from '../store/fileExplorerSlice';
import { RootState } from '../store';
import { FileItem } from '../types';

// Styled Components for Left Side Explorer
const LeftSidePanel = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  padding: 8px 0;
`;

const TreeItem = styled.div<{ isSelected: boolean }>`
  padding: 4px 8px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${props => props.isSelected ? '#e3e3ff' : 'transparent'};
  &:hover {
    background-color: ${props => props.isSelected ? '#e3e3ff' : '#f8f8f8'};
  }
`;

const FolderName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const ExpandButton = styled.span`
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  font-size: 12px;
  cursor: pointer;
`;

const FolderIcon = styled.span`
  margin-right: 6px;
  color: #ffd700;
  font-size: 14px;
`;

const IndentWrapper = styled.div<{ level: number }>`
  padding-left: ${props => props.level * 16}px;
  display: flex;
  align-items: center;
  width: 100%;
`;

interface FolderTreeItemProps {
  folder: FileItem;
  level: number;
  expandedFolders: Set<string>;
  toggleExpand: (folderId: string) => void;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ 
  folder, 
  level, 
  expandedFolders, 
  toggleExpand 
}) => {
  const dispatch = useDispatch();
  const files = useSelector((state: RootState) => state.fileExplorer.files);
  const selectedFileId = useSelector((state: RootState) => state.fileExplorer.selectedFileId);
  
  // Check if this folder has children
  const hasChildren = Object.values(files).some(file => file.parentId === folder.id);
  const isExpanded = expandedFolders.has(folder.id);
  const childFolders = Object.values(files)
    .filter(file => file.parentId === folder.id)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpand(folder.id);
  };
  
  const handleSelect = () => {
    dispatch(selectFile(folder.id));
  };
  
  return (
    <>
      <TreeItem isSelected={selectedFileId === folder.id} onClick={handleSelect}>
        <IndentWrapper level={level}>
          <ExpandButton onClick={handleToggleExpand}>
            {hasChildren && (isExpanded ? '▼' : '►')}
          </ExpandButton>
          <FolderIcon>📁</FolderIcon>
          <FolderName>{folder.name}</FolderName>
        </IndentWrapper>
      </TreeItem>
      
      {isExpanded && hasChildren && childFolders.map(childFolder => (
        <FolderTreeItem
          key={childFolder.id}
          folder={childFolder}
          level={level + 1}
          expandedFolders={expandedFolders}
          toggleExpand={toggleExpand}
        />
      ))}
    </>
  );
};

const LeftSideExplorer: React.FC = () => {
  const files = useSelector((state: RootState) => state.fileExplorer.files);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  
  const rootFolders = Object.values(files)
    .filter(file => file.parentId === null)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const toggleExpand = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };
  
  return (
    <LeftSidePanel>
      {rootFolders.map(folder => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          level={0}
          expandedFolders={expandedFolders}
          toggleExpand={toggleExpand}
        />
      ))}
    </LeftSidePanel>
  );
};

export default LeftSideExplorer;