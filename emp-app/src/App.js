import React, { useEffect, useState } from "react";
import axios from "axios";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import EmployeeForm from "./Components/EmployeeForm";
import EmployeeTable from "./Components/EmployeeTable";
import Navbar from "./Components/Navbar";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  return (
    <>
      {!isLoggedIn ? (
        !showSignup ? (
          <Login 
            setIsLoggedIn={setIsLoggedIn} 
            setShowSignup={setShowSignup}
          />
        ) : (
          <Signup setShowSignup={setShowSignup} />
        )
      ) : (
        <>
          {/* NAVBAR */}
          <Navbar setIsLoggedIn={setIsLoggedIn} />

          <div className="container mt-3">


            <EmployeeForm
              fetchData={fetchData}
              editData={editData}
              setEditData={setEditData}
            />

            <EmployeeTable
              data={data}
              fetchData={fetchData}
              setEditData={setEditData}
            />

          </div>
        </>
      )}
    </>
  );
}

export default App;