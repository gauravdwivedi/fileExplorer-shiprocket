// Types
export type FileType = 'file' | 'folder';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  position: { x: number; y: number };
}

export interface FileExplorerState {
  files: Record<string, FileItem>;
  selectedFileId: string | null;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    targetId: string | null;
  };
}
