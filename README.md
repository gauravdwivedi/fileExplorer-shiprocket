# File Explorer - Shiprocket

Welcome to the **File Explorer - Shiprocket** project! This application is a web-based file explorer that allows users to create, rename, duplicate, and delete folders through an intuitive graphical interface.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Code Explanation](#code-explanation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Create Folders**: Add new folders at any position within the explorer.
- **Rename Folders**: Modify existing folder names to keep your explorer organized.
- **Duplicate Folders**: Create copies of existing folders with ease.
- **Delete Folders**: Remove folders that are no longer needed.
- **Context Menu**: Right-click on the explorer area or on specific folders to access the context menu with relevant options.
- **Responsive Design**: The application is designed to be responsive and user-friendly.


## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/gauravdwivedi/fileExplorer-shiprocket.git

2. **Navigate to the project folder***:

    ```bash
    cd fileExplorer-shiprocket
3. **Install Dependencies**:
    ```bash
    npm install
4. **npm install**:
     ```bash
     npm start
5. **Visit app in your browser**:
    localhost:3000

# 🚀 Usage Guide

  ### Create New Folder
### Right-click on an empty area in the explorer.
### Select "Create New Folder".
### Enter the folder name in the modal and click "Create".

## ✏️ Rename Folder
### Right-click on the folder you want to rename.
### Select "Rename".
### Enter a new name and click "Rename".
## 📄 Duplicate Folder
### Right-click on the folder.
### Select "Duplicate" from the context menu.
## ❌ Delete Folder
### Right-click on the folder.
### Select "Delete" to remove the folder.


# 🧠 Code Explanation

## 📁 src/components/ContextMenu.tsx
### Context menu that handles folder operations.
### Modal support for create and rename folders.

## Uses Redux actions like:
### createFolder
### renameFolder
### duplicateFolder
### deleteFolder

## 📁 src/components/Explorer.tsx
### Displays all folders visually.
### Handles folder positioning and selection.
### Renders folder icon and name.
### Listens for right-click to trigger context menu.

## 📁 src/store/fileExplorerSlice.ts
### Contains Redux logic for folder state management.
### All actions for:
#### Create
#### Rename
#### Duplicate
#### Delete
#### Show/Hide context menu

## 📁 src/store/index.ts
### Configures Redux store using configureStore from @reduxjs/toolkit.







