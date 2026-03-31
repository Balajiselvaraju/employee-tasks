import React, { useState } from "react";
import axios from "axios";

function Signup({ setShowSignup }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSignup = () => {

    if (!form.name || !form.email || !form.password) {
      return alert("Please fill all fields");
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return alert("Invalid email format");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    axios.post("http://localhost:5000/signup", form)
      .then(res => {
        alert(res.data.message);
        setShowSignup(false); // back to login
      });
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow col-md-4 mx-auto">

        <h3 className="text-center mb-3">Signup</h3>

        <input
          className="form-control mb-2"
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-success w-100" onClick={handleSignup}>
          Signup
        </button>

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <button 
            className="btn btn-link"
            onClick={() => setShowSignup(false)}
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Signup;