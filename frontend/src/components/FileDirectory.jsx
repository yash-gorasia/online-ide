import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTraverseTree from '../hooks/useTraverseTree';
import { FaFolder, FaFolderOpen, FaFolderPlus} from "react-icons/fa";
import { FaFile, FaFileCirclePlus } from "react-icons/fa6";



const FileDirectory = ({ fileStruct: initialFileStruct }) => {
  const [fileStruct, setFileStruct] = useState(initialFileStruct || {});
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });

  const { insertNode } = useTraverseTree();

  const getFiles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/fileStruct/files');
      setFileStruct(res.data.root);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  };

  useEffect(() => {
    if (!initialFileStruct) {
      getFiles();
    }
  }, [initialFileStruct]);

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const handleInsertNode = (name, isFolder) => {
    const updatedTree = insertNode(fileStruct, fileStruct.name, name, isFolder);
    setFileStruct(updatedTree);
    setExpand(true);
  };

  const onAddNewFolder = (e) => {
    if (e.keyCode === 13 && showInput.visible && e.target.value.trim()) {
      handleInsertNode(e.target.value, showInput.isFolder);
      setShowInput({ visible: false });
    }
  };

  return fileStruct.isFolder ? (
    <div className=" border-l border-black pl-3">
      <div
        className="flex justify-between  items-center text-black hover:text-gray-800 cursor-pointer"
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
          <FileDirectory key={folder.name} fileStruct={folder} />
        ))}
    </div>
  ) : (
    <div className="ml-8 flex items-center text-black hover:text-gray-600 cursor-pointer">
      <FaFile className="mr-2" />
      <span>{fileStruct.name}</span>
    </div>
  );
};

export default FileDirectory;
