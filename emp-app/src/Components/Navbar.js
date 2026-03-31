import React from "react";

function Navbar({ setIsLoggedIn }) {

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">

      {/* Logo / Brand */}
      <a className="navbar-brand fw-bold" href="#">
        🚀 ASK Technology
      </a>

      {/* Right Side */}
      <div className="ms-auto">
        <button 
          className="btn btn-danger"
          onClick={() => setIsLoggedIn(false)}
        >
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;