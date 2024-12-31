import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTraverseTree from '../hooks/useTraverseTree';
import { FaFolder, FaFolderOpen, FaFolderPlus, FaTrash } from "react-icons/fa";
import { FaFile, FaFileCirclePlus } from "react-icons/fa6";

const FileDirectory = ({ fileStruct: initialFileStruct }) => {
  const [fileStruct, setFileStruct] = useState(initialFileStruct || {});
  const [userId, setUserId] = useState(null);
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });

  const { insertNode, deleteNode } = useTraverseTree();

  useEffect(() => {
    const userId = localStorage.getItem('user-info') ? JSON.parse(localStorage.getItem('user-info'))._id : null;
    setUserId(userId);
    if (!initialFileStruct) {
      getFiles(userId);
    }
  }, [initialFileStruct]);

  const getFiles = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/fileStruct/getFiles/${userId}`);
      setFileStruct(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createFile = async (userId, name, isFolder, parentId) => {
    try {
      const res = await axios.post('http://localhost:8000/api/fileStruct/createFile', {
        userId,
        name,
        isFolder,
        parentId,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFile = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/fileStruct/deleteFile/${id}`);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const handleInsertNode = async (name, isFolder) => {
    setExpand(true);

    // Create the file/folder in the backend
    const newFile = await createFile(userId, name, isFolder, fileStruct._id);
    if (newFile) {
      // Update the local state with the actual _id returned by the backend
      const updatedTree = insertNode(fileStruct, fileStruct._id, newFile.name, isFolder, newFile._id);
      setFileStruct(updatedTree);
    }
  };

  const handleDelete = async (id) => {
    await deleteFile(id); // Delete from the database

    // Update the local state
    const updatedTree = deleteNode(fileStruct, id);
    setFileStruct(updatedTree);
  };

  const onAddNewFolder = async (e) => {
    if (e.keyCode === 13 && showInput.visible && e.target.value.trim()) {
      await handleInsertNode(e.target.value, showInput.isFolder);
      setShowInput({ visible: false });
    }
  };

  // Handle empty fileStruct
  if (!fileStruct || Object.keys(fileStruct).length === 0) {
    return <div></div>;
  }

  return fileStruct.isFolder ? (
    <div className=" border-l border-black pl-3">
      <div
        className="flex justify-between items-center text-black hover:text-gray-800 cursor-pointer"
        onClick={() => setExpand(!expand)}
      >
        <div className="flex items-center gap-2">
          {expand ? <FaFolderOpen /> : <FaFolder />}
          <span className="font-medium">{fileStruct.name}</span>
        </div>
        <div className="flex gap-6">
          <button
            onClick={(e) => handleNewFolder(e, true)}
            className="hover:text-blue-400"
            title="New Folder"
          >
            <FaFolderPlus />
          </button>
          <button
            onClick={(e) => handleNewFolder(e, false)}
            className="hover:text-green-400"
            title="New File"
          >
            <FaFileCirclePlus />
          </button>
          <button
            onClick={() => handleDelete(fileStruct._id)}
            className="hover:text-red-400"
            title="Delete Folder"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {showInput.visible && (
        <div className="mt-2 flex items-center gap-2">
          {showInput.isFolder ? <FaFolder /> : <FaFile />}
          <input
            type="text"
            onKeyDown={onAddNewFolder}
            onBlur={() => setShowInput({ visible: false })}
            autoFocus
            placeholder={showInput.isFolder ? "New Folder" : "New File"}
            className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-400"
          />
        </div>
      )}

      {expand &&
        fileStruct.items.map((folder) => (
          <FileDirectory
            key={folder._id}
            fileStruct={folder}
          />
        ))}
    </div>
  ) : (
    <div className="ml-8 flex items-center text-black hover:text-gray-600 cursor-pointer">
      <FaFile className="mr-2" />
      <span>{fileStruct.name}</span>
      <button
        onClick={() => handleDelete(fileStruct._id)}
        className="hover:text-red-400"
        title="Delete File"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default FileDirectory;