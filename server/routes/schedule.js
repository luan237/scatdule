const express = require("express");
const app = express();
const router = express.Router();
// const uuid = require("uuid");
const fs = require("fs");
const knex = require("knex")(require("../knexfile").development);

// const fetchSchedule = async () => {
//   const getSchedule = await knex("schedule").then((data) => {
//     return data;
//   });
//   return getSchedule;
//   // return JSON.parse(fs.readFileSync("./data/schedule.json"));
// };

// const fetchIndividual = () => {
//   return JSON.parse(fs.readFileSync("./data/individual-schedule.json"));
// };
router
  .route("/")
  .get((req, res) => {
    knex("schedule").then((data) => {
      // console.log(data[0]);
      let newItem = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == data[i + 1]?.id) {
          Array(data[i].employees).push(data[i + 1].employees);
          Array(data[i].employeesID).push(data[i + 1].employeesID);
        } else {
          newItem.push(Array(data[i]));
        }
      }
      console.log(Array(data[0].employees));
      return res.status(200).json(newItem);
    });
  })
  .post((req, res) => {
    // const schedule = fetchSchedule();
    // const individualSchedule = fetchIndividual();
    const newData = { ...req.body };
    const checkedEmployeesID = newData.employeesID;
    for (employee of checkedEmployeesID) {
      // console.log(employee);
      knex("employee_list")
        .where("id", employee)
        .select("name")
        .then((data) => {
          let name = data[0].name;
          // console.log(data[0].name);
          const newInsert = {
            id: newData.id,
            task: newData.task,
            start: newData.start,
            end: newData.end,
            allDay: newData.allDay,
            employees: name,
            employeesID: employee,
          };
          knex("schedule")
            .insert(newInsert)
            .then((data) => {
              console.log(data);
            });
        })
        .then((data) => {
          // console.log(data);
          return res.json(data);
        });
      //   const foundPerson = individualSchedule.find((person) => {
      //     return Number(person.id) == Number(employee);
      //   });
      //   foundPerson.schedule.push({
      //     id: newData.id,
      //     start: newData.start,
      //     end: newData.end,
      //   });
      // }
      // schedule.push(newData);
      // fs.writeFile(
      //   "./data/individual-schedule.json",
      //   JSON.stringify(individualSchedule),
      //   (err) => {
      //     console.log(err);
      //   }
      // );
      // fs.writeFile("./data/schedule.json", JSON.stringify(schedule), (err) => {
      //   console.log(err);
      // });
      // res.status(200).json(newData);
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
