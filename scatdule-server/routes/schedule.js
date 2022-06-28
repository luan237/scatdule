const express = require("express");
const app = express();
const router = express.Router();
const uuid = require("uuid");
const fs = require("fs");
// const schedule = require("../data/schedule.json");
const jwt = require("jsonwebtoken");

const fetchSchedule = () => {
  return JSON.parse(fs.readFileSync("./data/schedule.json"));
};
router
  .route("/")
  .get((req, res) => {
    const schedule = fetchSchedule();
    res.status(200).json(schedule);
  })
  .post((req, res) => {
    const schedule = fetchSchedule();
    const newData = { ...req.body };
    schedule.push(newData);
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json(newData);
  });

router
  .route("/:id")
  .put((req, res) => {
    const schedule = fetchSchedule();
    const newData = req.body;
    const selectedScheduleId = req.params.id;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1, newData);
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json("Schedule updated");
  })
  .delete((req, res) => {
    const schedule = fetchSchedule();
    const selectedScheduleId = req.params.id;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1);
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json(schedule);
  });

module.exports = router;
