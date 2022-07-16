const express = require("express");
const router = express.Router();
const fs = require("fs");
const knex = require("knex")(require("../knexfile"));
const fetchUser = async () => {
  const getData = await knex("employee_list").then((data) => {
    return data;
  });
  return getData;
};

router
  .route("/:id")
  .get((req, res) => {
    knex("employee_list")
      .select("avatar")
      .where({ id: req.params.id })
      .then((data) => {
        if (data.length === 0) {
          return res.status(200).send("/avatar/no-avatar.png");
        }
        return res.status(200).send(data[0].avatar);
      });
  })
  .delete((req, res) => {
    knex("employee_list")
      .del()
      .where({ id: req.params.id })
      .then((data) => {
        if (data === 0) {
          return res
            .status(400)
            .json(`Can't find employee with id ${req.params.id}`);
        } else if (data === 1) {
          return res
            .status(200)
            .json(`Deleted employee number ${req.params.id}`);
        }
      });
  });

module.exports = router;
