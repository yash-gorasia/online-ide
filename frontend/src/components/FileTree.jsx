// src/components/FileTree.js
import { useState, useRef } from "react";
import { FaChevronRight, FaFile, FaEllipsisH } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu";

const FileTree = ({
  fileTree,
  handleOpenFile, // Updated prop for opening files in tabs
  handleAddFile,
  handleAddFolder,
  handleDelete,
  handleRename,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState({
    isFolder: false,
    showInput: false,
    folderId: null,
  });
  const [isRenaming, setIsRenaming] = useState({
    showInput: false,
    name: "",
    newName: "",
    id: null,
  });
  const inputRef = useRef(null);

  // Handle renaming a file/folder
  const handleRenameSubmit = () => {
    if (
      isRenaming.id &&
      isRenaming.newName &&
      isRenaming.name !== isRenaming.newName &&
      isRenaming.newName.trim() !== ""
    ) {
      handleRename(isRenaming.id, isRenaming.newName);
    }
    setIsRenaming({
      showInput: false,
      name: "",
      newName: "",
      id: null,
    });
  };

  // Handle adding a new file/folder
  const handleSubmission = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");

    if (name.trim() === "") return;

    if (isCreating.isFolder) {
      handleAddFolder(isCreating.folderId, name);
    } else {
      handleAddFile(isCreating.folderId, name);
    }

    e.target.reset();
    setIsCreating({ ...isCreating, showInput: false });
  };

  // Handle dropdown actions (new file, new folder, rename, delete)
  const handleDropdownItemClick = (action, fileTreeId, fileTreeName) => {
    switch (action) {
      case "newFile":
        setIsExpanded(true);
        setIsCreating({ isFolder: false, showInput: true, folderId: fileTreeId });
        break;
      case "newFolder":
        setIsExpanded(true);
        setIsCreating({ isFolder: true, showInput: true, folderId: fileTreeId });
        break;
      case "rename":
        setIsRenaming({ showInput: true, id: fileTreeId, name: fileTreeName });
        break;
      case "delete":
        handleDelete(fileTreeId);
        break;
      default:
        break;
    }
  };

  // Render a folder
  if (fileTree.isFolder) {
    return (
      <div>
        <div
          onMouseOver={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
          className="flex items-center justify-between p-1 hover:bg-gray-100 cursor-pointer"
        >
          <div className="flex items-center gap-1" onClick={() => setIsExpanded(!isExpanded)}>
            <FaChevronRight className={`${isExpanded ? "rotate-90" : ""} transition-transform`} />
            {isRenaming.showInput && isRenaming.id === fileTree._id ? (
              <input
                ref={inputRef}
                type="text"
                defaultValue={fileTree.name}
                onChange={(e) => setIsRenaming({ ...isRenaming, newName: e.target.value })}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
                className="border border-gray-300 px-1"
              />
            ) : (
              <span className="truncate">{fileTree.name}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`p-1 ${showOptions || isDropdownOpen ? "visible" : "invisible"}`}
          >
            <FaEllipsisH />
          </button>
          <DropdownMenu
            isOpen={isDropdownOpen}
            fileTreeId={fileTree._id}
            fileTreeName={fileTree.name}
            onClose={() => setIsDropdownOpen(false)}
            type="folder"
            onItemClick={handleDropdownItemClick}
          />
        </div>
        {isExpanded && (
          <div className="pl-4">
            {isCreating.showInput && (
              <form onSubmit={handleSubmission} className="flex items-center gap-1">
                {isCreating.isFolder ? <FaChevronRight /> : <FaFile />}
                <input
                  type="text"
                  name="name"
                  autoFocus
                  onBlur={() => setIsCreating({ ...isCreating, showInput: false })}
                  className="border border-gray-300 px-1"
                />
              </form>
            )}
            {fileTree.items.map((child) => (
              <FileTree
                key={child._id}
                fileTree={child}
                handleOpenFile={handleOpenFile} // Pass down the handleOpenFile function
                handleAddFile={handleAddFile}
                handleAddFolder={handleAddFolder}
                handleDelete={handleDelete}
                handleRename={handleRename}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render a file
  return (
    <div
      onMouseOver={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
      className="flex items-center justify-between p-1 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleOpenFile(fileTree)} // Use handleOpenFile to open the file in a tab
    >
      <div className="flex items-center gap-1">
        <FaFile />
        {isRenaming.showInput && isRenaming.id === fileTree._id ? (
          <input
            ref={inputRef}
            type="text"
            defaultValue={fileTree.name}
            onChange={(e) => setIsRenaming({ ...isRenaming, newName: e.target.value })}
            autoFocus
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
            className="border border-gray-300 px-1"
          />
        ) : (
          <span className="truncate">{fileTree.name}</span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        className={`p-1 ${showOptions || isDropdownOpen ? "visible" : "invisible"}`}
      >
        <FaEllipsisH />
      </button>
      <DropdownMenu
        isOpen={isDropdownOpen}
        fileTreeId={fileTree._id}
        fileTreeName={fileTree.name}
        onClose={() => setIsDropdownOpen(false)}
        type="file"
        onItemClick={handleDropdownItemClick}
      />
    </div>
  );
};

export default FileTree;