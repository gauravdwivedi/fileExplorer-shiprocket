// src/App.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import Explorer from './components/Explorer';
import FolderView from './components/FolderView';
import LeftSideExplorer from './components/LeftSideFileExplorer';
import { RootState } from './store';

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  height: 100vh;
  position: relative;
`;

const App: React.FC = () => {
  const selectedFileId = useSelector((state: RootState) => state.fileExplorer.selectedFileId);
  const files = useSelector((state: RootState) => state.fileExplorer.files);
  
  const selectedFile = selectedFileId ? files[selectedFileId] : null;
  const isInFolder = selectedFile && selectedFile.type === 'folder' && selectedFile.id !== 'root';
  
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <LeftSideExplorer />
        <MainContent>
          {isInFolder ? (
            <FolderView folderId={selectedFileId as string} />
          ) : (
            <Explorer />
          )}
        </MainContent>
      </AppContainer>
    </DndProvider>
  );
};

export default App;