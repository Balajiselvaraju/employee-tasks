import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployeeForm({ fetchData, editData, setEditData }) {

  const [form, setForm] = useState({
    code: "",
    name: "",
    dept_id: "",
    desig_id: "",
    dob: "",
    doj: "",
    gender: "",
    salary: ""
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/departments")
      .then(res => setDepartments(res.data));
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        code: editData.code,
        name: editData.name,
        dept_id: editData.dept_id,
        desig_id: editData.desig_id,
        dob: editData.dob?.split("T")[0],
        doj: editData.doj?.split("T")[0],
        gender: editData.gender,
        salary: editData.salary
      });

      axios.get(`http://localhost:5000/designation/${editData.dept_id}`)
        .then(res => setDesignations(res.data));
    }
  }, [editData]);

  const handleDeptChange = (e) => {
    const dept_id = e.target.value;
    setForm({ ...form, dept_id, desig_id: "" });

    axios.get(`http://localhost:5000/designation/${dept_id}`)
      .then(res => setDesignations(res.data));
  };

  const handleSubmit = () => {

    // 🔴 EMPTY CHECK
if (
  !form.code || !form.name || !form.dept_id ||
  !form.desig_id || !form.dob || !form.doj ||
  !form.gender || !form.salary
) {
  return alert("⚠️ Fill all fields");
}

// ✅ DOB VALIDATION (Age >= 18)
const dobDate = new Date(form.dob);
const today = new Date();

let age = today.getFullYear() - dobDate.getFullYear();
const monthDiff = today.getMonth() - dobDate.getMonth();

if (
  age < 18 ||
  (age === 18 && monthDiff < 0) ||
  (age === 18 && monthDiff === 0 && today.getDate() < dobDate.getDate())
) {
  return alert("❌ Employee must be at least 18 years old");
}

// ✅ DOJ VALIDATION (>= today)
const dojDate = new Date(form.doj);
today.setHours(0, 0, 0, 0);

if (dojDate < today) {
  return alert("❌ DOJ cannot be in the past");
}    

    if (editData) {
      axios.put(`http://localhost:5000/employees/${form.code}`, form)
        .then(() => {
          fetchData();
          alert("Updated Successfully");
          resetForm();
        });
    } else {
      axios.post("http://localhost:5000/employees", form)
        .then(() => {
          fetchData();
          alert("Added Successfully");
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setEditData(null);
    setForm({
      code: "",
      name: "",
      dept_id: "",
      desig_id: "",
      dob: "",
      doj: "",
      gender: "",
      salary: ""
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white text-center">
          <h4>Employee Form</h4>
        </div>

        <div className="card-body">

          <div className="row g-3">

            {/* Code */}
            <div className="col-md-6">
              <label className="form-label">Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Code"
                value={form.code}
                disabled={editData}
                onChange={e => setForm({ ...form, code: e.target.value })}
              />
            </div>

            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Department */}
            <div className="col-md-6">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={form.dept_id}
                onChange={handleDeptChange}
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.dept_id} value={d.dept_id}>
                    {d.dept_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div className="col-md-6">
              <label className="form-label">Designation</label>
              <select
                className="form-select"
                value={form.desig_id}
                onChange={e => setForm({ ...form, desig_id: e.target.value })}
              >
                <option value="">Select Designation</option>
                {designations.map(d => (
                  <option key={d.desig_id} value={d.desig_id}>
                    {d.desig_name}
                  </option>
                ))}
              </select>
            </div>

            {/* DOB */}
            <div className="col-md-6">
              <label className="form-label">DOB</label>
              <input
                type="date"
                className="form-control"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
              />
            </div>

            {/* DOJ */}
            <div className="col-md-6">
              <label className="form-label">DOJ</label>
              <input
                type="date"
                className="form-control"
                value={form.doj}
                onChange={e => setForm({ ...form, doj: e.target.value })}
              />
            </div>

            {/* Gender */}
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            {/* Salary */}
            <div className="col-md-6">
              <label className="form-label">Salary</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Salary"
                value={form.salary}
                onChange={e => setForm({ ...form, salary: e.target.value })}
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="text-center mt-4">
            <button className="btn btn-success me-2" onClick={handleSubmit}>
              {editData ? "Update" : "Add"}
            </button>

            {editData && (
              <button className="btn btn-danger" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;