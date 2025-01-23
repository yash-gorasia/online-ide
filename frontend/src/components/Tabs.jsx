import React from 'react';
import { FaFile, FaCross } from 'react-icons/fa'; 

const Tabs = ({ tab, isSelected, onClick, handleCloseTab }) => {
  const activeClass = isSelected ? "bg-white text-vsdark-5" : "bg-transparent text-vsdark-4";

  return (
    <div
      role="button"
      onClick={onClick}
      className={`${activeClass} px-4 py-2 text- rounded-md  border-r border-vsdark-3 flex items-center gap-3 hover:bg-zinc-100 hover:text-vsdark-5`}
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
        <FaCross size={12} />
      </button>
    </div>
  );
}

export default Tabs;