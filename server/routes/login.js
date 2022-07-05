const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
// BCRYPT//
const bcrypt = require("bcrypt");
//

const fetchLogin = () => {
  return JSON.parse(fs.readFileSync("./data/login.json"));
};

const fetchUser = () => {
  return JSON.parse(fs.readFileSync("./data/employeeList.json"));
};

const authorize = (req, res, next) => {
  // if no header authorized, response with error
  if (!req.headers.authorization)
    return res.status(401).json({
      success: false,
      message: "This route requires authorization header",
    });
  // if header is empty (missing Bearer), response with error
  if (req.headers.authorization.indexOf("Bearer") === -1)
    return res
      .status(401)
      .json({ success: false, message: "This route requires Bearer token" });

  // if header got Bearer token
  const authToken = req.headers.authorization.split(" ")[1];
  //then verify token
  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    // if token is invalid
    if (err)
      return res
        .status(401)
        .json({ success: false, message: "The token is invalid" });
    // if token is valid, process
    req.jwtDecoded = decoded;
    next();
  });
};

router
  .route("/")
  .post((req, res) => {
    // get employee and password
    const { employeeID, password } = req.body;
    const employeeList = fetchLogin();
    const employee = employeeList.find((person) => person.id == employeeID);
    if (!employee) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    bcrypt.compare(password, employee.password, (_err, result) => {
      if (!result) {
        return res
          .status(401)
          .json({ success: false, message: `Wrong password` });
      } else if (result) {
        const token = jwt.sign(
          {
            employeeID: employee.id,
            position: employee.position,
          },
          process.env.JWT_SECRET
        );
        return res.status(200).json(token);
      }
    });
  })
  .get(authorize, (req, res) => {
    const employeeList = fetchUser();
    if (req.jwtDecoded.position === "employer") {
      return res.status(200).json(employeeList);
    } else if (req.jwtDecoded.position === "manager") {
      const newList = employeeList.filter(
        (person) => person.position === "employee"
      );
      return res.status(200).json(newList);
    } else if (req.jwtDecoded.position === "employee") {
      const found = employeeList.find(
        (person) => person.id === req.jwtDecoded.employeeID
      );
      res.status(200).json([found]);
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
  });

module.exports = router;
