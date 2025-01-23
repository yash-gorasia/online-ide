import React from 'react';
import { FaFile, FaRegWindowClose } from 'react-icons/fa'; 

const Tabs = ({ tab, isSelected, onClick, handleCloseTab }) => {
  const activeClass = isSelected ? "bg-white text-vsdark-5" : "bg-transparent text-vsdark-4";

  return (
    <div
      role="button"
      onClick={onClick}
      className={`${activeClass} ml-1 mb-2 px-3 py-1 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] hover:shadow transition duration-200 rounded-md flex items-center gap-3  hover:text-vsdark-5`}
    >
      <div className="flex items-center gap-1.5">
        <span className="flex items-center">
          <FaFile size={12} />
        </span>
        <span>{tab.name}</span>
      </div>
      <button
        className="min-w-5 min-h-5 rounded hover:bg-vsdark-3 flex justify-center transition active:translate-y-[1px] items-center"
        onClick={(e) => {
          e.stopPropagation();
          handleCloseTab(tab.id);
        }}
      >
        <FaRegWindowClose size={12} />
      </button>
    </div>
  );
}

export default Tabs;