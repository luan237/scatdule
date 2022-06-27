const express = require("express");
const app = express();
const router = express.Router();
const fs = require("fs");
const fetchUser = () => {
  return fs.readFile("./data/employeeList.json");
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
  const authToken = req.header.authorization.split(" ")[1];
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

router.route("/login").post((req, res) => {
  const { user, password } = req.body;
  const userList = fetchUser();
  const userID = userList[user];
});

module.exports = login;
