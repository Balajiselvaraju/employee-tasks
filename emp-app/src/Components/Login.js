import React, { useState } from "react";
import axios from "axios";

function Login({ setIsLoggedIn, setShowSignup }) {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = () => {

    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }

    axios.post("http://localhost:5000/login", form)
      .then(res => {
        if (res.data.success) {
          alert("Login Successful");
          setIsLoggedIn(true);
        } else {
          alert(res.data.message);
        }
      });
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow col-md-4 mx-auto">

        <h3 className="text-center mb-3">Login</h3>

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

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <button 
            className="btn btn-link"
            onClick={() => setShowSignup(true)}
          >
            Signup
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;