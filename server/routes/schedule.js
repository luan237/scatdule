const express = require("express");
const app = express();
const router = express.Router();
const uuid = require("uuid");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const fetchSchedule = () => {
  return JSON.parse(fs.readFileSync("./data/schedule.json"));
};

const fetchIndividual = () => {
  return JSON.parse(fs.readFileSync("./data/individual-schedule.json"));
};
router
  .route("/")
  .get((req, res) => {
    const schedule = fetchSchedule();
    res.status(200).json(schedule);
  })
  .post((req, res) => {
    const schedule = fetchSchedule();
    const individualSchedule = fetchIndividual();
    const newData = { ...req.body };
    const checkedEmployeesID = newData.employeesID;
    for (employee of checkedEmployeesID) {
      const foundPerson = individualSchedule.find((person) => {
        return Number(person.id) == Number(employee);
      });
      foundPerson.schedule.push({
        id: newData.id,
        start: newData.start,
        end: newData.end,
      });
    }
    schedule.push(newData);
    fs.writeFile(
      "./data/individual-schedule.json",
      JSON.stringify(individualSchedule),
      (err) => {
        console.log(err);
      }
    );
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json(newData);
  });

router
  .route("/:id")
  .get((req, res) => {
    const employeeID = req.params.id;
    const individualSchedule = fetchIndividual();
    const scheduleList = individualSchedule.find(
      (employee) => employee.id == employeeID
    ).schedule;
    if (scheduleList) {
      return res.status(200).json(scheduleList);
    } else {
      return res.status(200).send("No schedule for this week");
    }
  })
  .put((req, res) => {
    const schedule = fetchSchedule();
    const individualSchedule = fetchIndividual();
    const newData = req.body;
    const selectedScheduleId = req.params.id;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1, newData);
    /////
    const checkedEmployeesID = newData.employeesID;
    for (employee of checkedEmployeesID) {
      const foundPerson = individualSchedule.find((person) => {
        return Number(person.id) == Number(employee);
      });
      const foundShift = foundPerson.schedule.findIndex((shift) => {
        return shift.id === newData.id;
      });
      const newShift = {
        id: newData.id,
        start: newData.start,
        end: newData.end,
      };
      foundPerson.schedule.splice(foundShift, 1, newShift);
    }
    fs.writeFile(
      "./data/individual-schedule.json",
      JSON.stringify(individualSchedule),
      (err) => {
        console.log(err);
      }
    );
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json("Schedule updated");
  })
  .delete((req, res) => {
    const schedule = fetchSchedule();
    const individualSchedule = fetchIndividual();
    const selectedScheduleId = req.params.id;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1);
    ///////////
    for (person of individualSchedule) {
      const foundShift = person.schedule.findIndex((shift) => {
        return shift.id === selectedScheduleId;
      });
      if (foundShift >= 0) {
        person.schedule.splice(foundShift, 1);
        console.log(foundShift);
      }
    }

    fs.writeFile(
      "./data/individual-schedule.json",
      JSON.stringify(individualSchedule),
      (err) => {
        console.log(err);
      }
    );
    fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      console.log(err);
    });
    res.status(200).json(schedule);
  });

module.exports = router;
