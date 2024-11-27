import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTraverseTree from '../hooks/useTraverseTree';

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

  if (fileStruct.isFolder) {
    return (
      <div className="mt-5 ml-5 border-l-2 border-zinc-800">
        <div
          className="folder cursor-pointer w-1/6"
          onClick={() => setExpand(!expand)}
        >
          <span className="flex justify-between">
            📁 {fileStruct.name}
            <div className="flex gap-8">
              <button onClick={(e) => handleNewFolder(e, true)}>Folder++</button>
              <button onClick={(e) => handleNewFolder(e, false)}>File++</button>
            </div>
          </span>
        </div>

        {showInput.visible && (
          <div>
            <span>{showInput.isFolder ? '📁' : '📄'}</span>
            <input
              type="text"
              onKeyDown={onAddNewFolder}
              onBlur={() => setShowInput({ visible: false })}
              autoFocus
              className="input_conatainer border"
            />
          </div>
        )}

        {expand &&
          fileStruct.items.map((folder) => (
            <FileDirectory key={folder.name} fileStruct={folder} />
          ))}
      </div>
    );
  } else {
    return (
      <span className="file ml-5 border-l-2 border-zinc-800 cursor-pointer">
        📄 {fileStruct.name} <br />
      </span>
    );
  }
};

export default FileDirectory;
