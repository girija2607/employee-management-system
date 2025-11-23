import React from "react";
import { GoHome } from "react-icons/go";
import { LuUsers, LuCalendar, LuMessageSquare } from "react-icons/lu";
import "../EmployeeCommon.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">RS-TECH</div>

      <nav>
        <button className="nav-item">
          <GoHome className="nav-icon" />
          <span>Dashboard</span>
        </button>

        <button className="nav-item active">
          <LuUsers className="nav-icon" />
          <span>Employee</span>
        </button>

        <button className="nav-item">
          <LuCalendar className="nav-icon" />
          <span>Calendar</span>
        </button>

        <button className="nav-item">
          <LuMessageSquare className="nav-icon" />
          <span>Messages</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;