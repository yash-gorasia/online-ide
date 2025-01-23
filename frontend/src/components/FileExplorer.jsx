import { useEffect, useState } from "react";
import axios from "axios";
import FileTree from "./FileTree";
import useTree from "../hooks/useTraverseTree.js";

const FileExplorer = ({ handleActiveEditorTabs, setActiveEditorTabs, activeEditorTabs, setSelectedTabId }) => {
  const [fileTree, setFileTree] = useState(null);
  const [userId, setUserId] = useState(null);
  const { insertNode, deleteNode, updateNode } = useTree();

  // Fetch userId from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user-info");
    if (user) {
      const { _id } = JSON.parse(user);
      setUserId(_id);
    }
  }, []);

  // Fetch the file tree from the backend
  const fetchFileTree = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/fileStruct/getFiles/${userId}`);
      setFileTree(response.data);
    } catch (error) {
      console.error("Failed to fetch file tree:", error);
    }
  };

  // Fetch file tree when userId changes
  useEffect(() => {
    if (!userId) return;
    fetchFileTree();
  }, [userId]);

  // Handle renaming a file/folder
  const handleRename = async (id, newName) => {
    try {
      await axios.put("http://localhost:8000/api/fileStruct/renameFile", { id, name: newName });
      // Update the file tree locally
      const updatedTree = updateNode(fileTree, id, newName);
      setFileTree(updatedTree);
      // Update the active editor tabs
      setActiveEditorTabs(activeEditorTabs.map((tab) => (tab.id === id ? { ...tab, name: newName } : tab)));
    } catch (error) {
      console.error("Failed to rename file/folder:", error);
    }
  };

  // Handle deleting a file/folder
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/fileStruct/deleteFile/${id}`);
      // Update the file tree locally
      const updatedTree = deleteNode(fileTree, id);
      setFileTree(updatedTree || null);
      // Update the active editor tabs
      setActiveEditorTabs(activeEditorTabs.filter((tab) => tab.id !== id));
    } catch (error) {
      console.error("Failed to delete file/folder:", error);
    }
  };

  // Handle adding a new file
  const handleAddFile = async (parentId, fileName) => {
    try {
      const response = await axios.post("http://localhost:8000/api/fileStruct/createFile", {
        userId: userId,
        name: fileName,
        isFolder: false,
        parentId,
      });
      const newFile = response.data;
      // Update the file tree locally
      const updatedTree = insertNode(fileTree, parentId, newFile);
      setFileTree(updatedTree);
      // Update the active editor tabs
      setActiveEditorTabs([...activeEditorTabs, { id: newFile._id, name: newFile.name, data: newFile.content }]);
      setSelectedTabId(newFile._id);
    } catch (error) {
      console.error("Failed to create file:", error);
    }
  };

  // Handle adding a new folder
  const handleAddFolder = async (parentId, folderName) => {
    try {
      const response = await axios.post("http://localhost:8000/api/fileStruct/createFile", {
        userId: userId,
        name: folderName,
        isFolder: true,
        parentId,
      });
      const newFolder = response.data;
      // Update the file tree locally
      const updatedTree = insertNode(fileTree, parentId, newFolder);
      setFileTree(updatedTree);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  // Handle opening a file in a new tab
  const handleOpenFile = (file) => {
    if (!file.isFolder) {
      const existingTab = activeEditorTabs.find((tab) => tab.id === file._id);
      if (!existingTab) {
        setActiveEditorTabs([...activeEditorTabs, { id: file._id, name: file.name, data: file.content }]);
      }
      setSelectedTabId(file._id);
    }
  };

  return (
    <div className="min-w-80 border-r border-r-vsdark-3 flex flex-col h-[calc(100vh-7rem)]">
      <div className="px-4 py-2 border-b border-b-vsdark-3">
        <h3 className="text-xxs uppercase text-vsdark-4">Explorer</h3>
      </div>
      <div className="p-2 h-full">
        {fileTree ? (
          <FileTree
            handleDelete={handleDelete}
            handleAddFile={handleAddFile}
            handleAddFolder={handleAddFolder}
            handleRename={handleRename}
            fileTree={fileTree}
            handleOpenFile={handleOpenFile}
          />
        ) : (
          <p>Loading file tree...</p>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;