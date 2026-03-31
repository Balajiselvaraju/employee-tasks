import React from "react";
import axios from "axios";

function EmployeeTable({ data, fetchData, setEditData }) {

  const handleDelete = (code) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios.delete(`http://localhost:5000/employees/${code}`)
        .then(() => fetchData());
    }
  };

  const handleEdit = (emp) => {
    setEditData(emp);
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        {/* Header */}
        <div className="card-header bg-dark text-white text-center">
          <h4>Employee List</h4>
        </div>

        {/* Table */}
        <div className="card-body">

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped align-middle text-center">

              <thead className="table-primary">
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>DOB</th>
                  <th>DOJ</th>
                  <th>Gender</th>
                  <th>Salary</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map(emp => (
                    <tr key={emp.code}>
                      <td>{emp.code}</td>
                      <td>{emp.name}</td>
                      <td>{emp.dept_name}</td>
                      <td>{emp.desig_name}</td>
                      <td>{emp.dob?.split("T")[0]}</td>
                      <td>{emp.doj?.split("T")[0]}</td>
                      <td>{emp.gender}</td>
                      <td>₹ {emp.salary}</td>

                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(emp.code)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>

      </div>

    </div>
  );
}

export default EmployeeTable;