const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ============================
// GET ALL DEPARTMENTS
// ============================
app.get("/departments", (req, res) => {
  const sql = "SELECT * FROM department";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ============================
// GET DESIGNATIONS BY DEPARTMENT
// ============================
app.get("/designation/:dept_id", (req, res) => {
  const dept_id = req.params.dept_id;

  const sql = "SELECT * FROM designation WHERE dept_id = ?";

  db.query(sql, [dept_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ============================
// GET ALL EMPLOYEES
// ============================
app.get("/employees", (req, res) => {

  const sql = `
    SELECT e.code, e.name, e.dob, e.doj, e.gender, e.salary,
           d.dept_name,
           ds.desig_name
    FROM employee e
    JOIN department d ON e.dept_id = d.dept_id
    JOIN designation ds ON e.desig_id = ds.desig_id
    ORDER BY e.code ASC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ============================
// ADD EMPLOYEE (WITH VALIDATION)
// ============================
app.post("/employees", (req, res) => {

  const { code, name, dept_id, desig_id, dob, doj, gender, salary } = req.body;

  // VALIDATIONS
  if (!code || !/^[0-9]+$/.test(code)) {
    return res.status(400).json({ message: "Code must be numeric" });
  }

  if (!name || name.length > 50) {
    return res.status(400).json({ message: "Name max 50 characters" });
  }

  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  if (age < 18) {
    return res.status(400).json({ message: "Employee must be 18+" });
  }

  if (new Date(doj) < new Date().setHours(0,0,0,0)) {
    return res.status(400).json({ message: "DOJ must be today or future" });
  }

  if (salary > 9999999) {
    return res.status(400).json({ message: "Salary max 7 digits" });
  }

  // CHECK DUPLICATE CODE
  db.query("SELECT * FROM employee WHERE code = ?", [code], (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: "Code already exists" });
    }

    const sql = `
      INSERT INTO employee
      (code, name, dept_id, desig_id, dob, doj, gender, salary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
      [code, name, dept_id, desig_id, dob, doj, gender, salary],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Employee Added Successfully" });
      }
    );
  });

});

// ============================
// DELETE EMPLOYEE
// ============================
app.delete("/employees/:code", (req, res) => {
  const code = req.params.code;

  const sql = "DELETE FROM employee WHERE code = ?";

  db.query(sql, [code], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee Deleted" });
  });
});

// ============================
// UPDATE EMPLOYEE
// ============================
app.put("/employees/:code", (req, res) => {

  const code = req.params.code;
  const { name, dept_id, desig_id, dob, doj, gender, salary } = req.body;

  const sql = `
    UPDATE employee
    SET name=?, dept_id=?, desig_id=?, dob=?, doj=?, gender=?, salary=?
    WHERE code=?
  `;

  db.query(sql,
    [name, dept_id, desig_id, dob, doj, gender, salary, code],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Employee Updated Successfully" });
    }
  );
});
// ============================
// SIGNUP
// ============================
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "All fields required" });
  }

  const checkSql = "SELECT * FROM users WHERE email=?";
  db.query(checkSql, [email], (err, result) => {

    if (result.length > 0) {
      return res.json({ message: "Email already exists" });
    }

    const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

    db.query(sql, [name, email, password], (err) => {
      if (err) return res.json(err);
      res.json({ message: "Signup successful" });
    });
  });
});


// ============================
// LOGIN
// ============================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ============================
// START SERVER
// ============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});