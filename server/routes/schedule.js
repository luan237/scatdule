const express = require("express");
const app = express();
const router = express.Router();
const fs = require("fs");
const knex = require("knex")(require("../knexfile").development);

const appendSchedule = (list) => {
  let newList = [];
  for (let i = 0; i < list.length; i++) {
    if (!list[i]) {
      return newList;
    } else {
      newList.push(list[i]);
      list.splice(i, 1);
      if (
        !Array.isArray(newList[i].employees) &&
        !Array.isArray(newList[i].employeesID)
      ) {
        newList[i].employees = [newList[i].employees];
        newList[i].employeesID = [newList[i].employeesID];
      }
      const others = list.filter((items) => items.id == newList[i].id);
      for (item of others) {
        newList[i].employees.push(item.employees);
        newList[i].employeesID.push(item.employeesID);
        const eachIndex = list.findIndex(
          (sche) => sche.employees == item.employees
        );
        list.splice(eachIndex, 1);
      }
    }
  }
  return newList;
};
router
  .route("/")
  .get((req, res) => {
    knex("schedule").then((data) => {
      let scheduleData = JSON.parse(JSON.stringify(data));
      let combinedSchedule = appendSchedule(scheduleData);
      return res.status(200).send(combinedSchedule);
    });
  })
  .post((req, res) => {
    const newData = { ...req.body };
    // console.log(newData);
    const checkedEmployeesID = newData.employeesID;
    for (employee of checkedEmployeesID) {
      knex("employee_list")
        .where("id", employee)
        .select("name", "id")
        .then((data) => {
          console.log(data);
          let name = data[0].name;
          let id = data[0].id;
          const newInsert = {
            id: newData.id,
            task: newData.task,
            start: newData.start,
            end: newData.end,
            allDay: newData.allDay,
            employees: name,
            employeesID: id,
          };
          knex("schedule")
            .insert(newInsert)
            .then((data) => {
              console.log(data);
            });
        })
        .then((data) => {
          return res.json(data);
        });
    }
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
      if (foundShift !== -1) {
        foundPerson.schedule.splice(foundShift, 1, newShift);
      } else if (foundShift === -1) {
        foundPerson.schedule.push(newShift);
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
    res.status(200).json("Schedule updated");
  })
  .delete((req, res) => {
    const schedule = fetchSchedule();
    const individualSchedule = fetchIndividual();
    const selectedScheduleId = req.params.id;
    foundIndex = schedule.findIndex((event) => event.id === selectedScheduleId);
    schedule.splice(foundIndex, 1);

    for (person of individualSchedule) {
      const foundShift = person.schedule.findIndex((shift) => {
        return shift.id === selectedScheduleId;
      });
      if (foundShift >= 0) {
        person.schedule.splice(foundShift, 1);
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
