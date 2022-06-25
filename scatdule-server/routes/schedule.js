const express = require("express");
const app = express();
const router = express.Router();
const uuid = require("uuid");
const fs = require("fs");
const schedule = require("../data/schedule.json");
const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  // if no header authorized, response with error
  if (!req.headers.authorization)
    return res
      .status(401)
      .json({
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
router
  .route("/")
  .get((req, res) => {
    res.status(200).json(schedule);
  })
  .post((req, res) => {
    const newData = { ...req.body, id: uuid.v4() };
    schedule.push(newData);
    fs.writeFile("../data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json(newData);
  });
router
  .route("/:id")
  .put((req, res) => {
    const newData = req.body;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1, newData);
    fs.writeFile("../data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json("Schedule updated");
  })
  .delete((req, res) => {
    const selectedScheduleId = req.params.id;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1);
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json(schedule);
  });

module.exports = router;
