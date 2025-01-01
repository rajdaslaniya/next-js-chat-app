import React, { useState } from "react";

const LeftSideDrawerExample: React.FC = () => {
  // State to control the drawer open/close
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };

  return (
    <div>
      <button
        onClick={() => toggleDrawer(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Open Left Drawer
      </button>

      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-50 transition-all duration-300 ${
          open ? "block" : "hidden"
        }`}
        onClick={() => toggleDrawer(false)}
      >
        <div
          className={`fixed left-0 top-0 w-64 bg-white h-full shadow-lg transition-transform transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        ></div>
      </div>
    </div>
  );
};

export default LeftSideDrawerExample;
