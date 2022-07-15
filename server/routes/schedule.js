const express = require("express");
const app = express();
const router = express.Router();
const fs = require("fs");
const knex = require("knex")(require("../knexfile").development);

const appendSchedule = (list) => {
  // bug if 1 single person is set
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
      return res.status(200).json(combinedSchedule);
    });
  })
  .post((req, res) => {
    const newData = { ...req.body };
    const checkedEmployeesID = newData.employeesID;
    for (employee of checkedEmployeesID) {
      knex("employee_list")
        .where("id", employee)
        .select("name", "id")
        .then((data) => {
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
            .then((data) => {});
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
    knex("schedule")
      .where("employeesID", employeeID)
      .then((data) => {
        if (data) {
          return res.status(200).json(data);
        } else {
          return res.status(200).send("No schedule this week");
        }
      });
  })
  .put((req, res) => {
    const newChange = req.body;
    knex("schedule")
      .where("id", req.params.id)
      .then((data) => {
        let updateData = JSON.parse(JSON.stringify(data));
        let updatedList = newChange.employees;
        updatedList.forEach((personName) => {
          knex("schedule")
            .where({ id: req.params.id })
            .andWhere({ employees: personName })
            .then((data) => {
              if (data.length == 0) {
                knex("employee_list")
                  .select("id")
                  .where({ name: personName })
                  .then((id) => {
                    const newInsert = {
                      id: newChange.id,
                      task: newChange.task,
                      start: newChange.start,
                      end: newChange.end,
                      allDay: newChange.allDay,
                      employees: personName,
                      employeesID: id[0].id,
                    };
                    knex("schedule")
                      .insert(newInsert)
                      .then((res) => {});
                  });
              }
            });
          updateData.forEach((person) => {
            if (!newChange.employees.includes(person.employees)) {
              knex("schedule")
                .del()
                .where({ id: req.params.id })
                .andWhere({ employees: person.employees })
                .then((data) => {});
            } else if (newChange.employees.includes(person.employees)) {
              knex("schedule")
                .where({ id: req.params.id })
                .andWhere({ employees: person.employees })
                .update({
                  task: newChange.task,
                  start: newChange.start,
                  end: newChange.end,
                  allDay: newChange.allDay,
                })
                .then((data) => {});
            }
          });
        });

        return res.status(200).json(updateData);
      });
  })
  .delete((req, res) => {
    knex("schedule")
      .del()
      .where({ id: req.params.id })
      .then((data) => {
        return res.status(200).json(data);
      });
  });

module.exports = router;
