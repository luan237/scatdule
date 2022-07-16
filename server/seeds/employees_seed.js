// import seed data files, arrays of objects
const employees = require("../seed_data/employee_list");
const loginInfo = require("../seed_data/login");

exports.seed = function (knex) {
  return knex("employee_list")
    .del()
    .then(function () {
      return knex("employee_list").insert(employees);
    })
    .then(() => {
      return knex("login").del();
    })
    .then(() => {
      return knex("login").insert(loginInfo);
    });
};
