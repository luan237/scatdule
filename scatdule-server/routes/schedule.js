const express = require("express");
const app = express();
const router = express.Router();
const uuid = require("uuid");
const fs = require("fs");
const schedule = require("../data/schedule.json");
const jwt = require("jsonwebtoken");

router
  .route("/")
  .get((req, res) => {
    res.status(200).json(schedule);
  })
  .post((req, res) => {
    const newData = { ...req.body, id: uuid.v4() };
    console.log(newData);
    schedule.push(newData);
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
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
    console.log(req.params.id);
    const selectedScheduleId = req.params.id;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1);
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json(schedule);
  });

module.exports = router;
