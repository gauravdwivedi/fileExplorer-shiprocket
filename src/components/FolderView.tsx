import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { selectFile } from "../store/fileExplorerSlice";
import Folder from "./Folder";

// FolderView Component - for viewing inside folders
interface FolderViewProps {
    folderId: string;
  }
  
  const FolderView: React.FC<FolderViewProps> = ({ folderId }) => {
    const dispatch = useDispatch();
    const files = useSelector((state: RootState) => state.fileExplorer.files);
    
    const folder = files[folderId];
    if (!folder) return null;
    
    const childFiles = Object.values(files).filter(file => file.parentId === folderId);
    
    const handleBackClick = () => {
      if (folder.parentId) {
        // Navigate to parent folder
        dispatch(selectFile(folder.parentId));
      }
    };
    
    return (
      <div>
        <div>
          <button onClick={handleBackClick}>Back</button>
          <h2>{folder.name}</h2>
        </div>
        <div>
          {childFiles.map(file => (
            <Folder key={file.id} folder={file} />
          ))}
        </div>
      </div>
    );
  };

  export default FolderView;