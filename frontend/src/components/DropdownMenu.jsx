// src/components/DropdownMenu.js
function DropdownMenu({ isOpen, onClose, type, onItemClick, fileTreeId, fileTreeName }) {
    if (!isOpen) return null;

    return (
        <div className={`absolute ${type === "folder" ? "mt-44" : "mt-28"} ml-20 w-48 bg-white border border-gray-200 rounded shadow-lg z-10`}>
            {type === "folder" && (
                <>
                    <button
                        onClick={() => onItemClick("newFile", fileTreeId, fileTreeName)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        New File
                    </button>
                    <button
                        onClick={() => onItemClick("newFolder", fileTreeId, fileTreeName)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        New Folder
                    </button>
                </>
            )}
            <button
                onClick={() => onItemClick("rename", fileTreeId, fileTreeName)}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Rename
            </button>
            <button
                onClick={() => onItemClick("delete", fileTreeId, fileTreeName)}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Delete {type === "folder" ? "Folder" : "File"}
            </button>
        </div>
    );
}

export default DropdownMenu;