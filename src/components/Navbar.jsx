import React from "react";

// Define the Navbar component
const Navbar = ({ handleFilterChange }) => {
  return (
    <div className="navbar">
      <button id="navbutton" onClick={() => handleFilterChange("all")}>
        All
      </button>
      <button id="navbutton" onClick={() => handleFilterChange("completed")}>
        Completed
      </button>
      <button
        id="navbutton"
        onClick={() => handleFilterChange("priority", "Low")}
      >
        Low Priority
      </button>
      <button
        id="navbutton"
        onClick={() => handleFilterChange("priority", "Medium")}
      >
        Medium Priority
      </button>
      <button
        id="navbutton"
        onClick={() => handleFilterChange("priority", "High")}
      >
        High Priority
      </button>
      <button id="navbutton" onClick={() => handleFilterChange("urgent")}>
        Urgent (Due in a week)
      </button>
    </div>
  );
};

export default Navbar;
