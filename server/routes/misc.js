const express = require("express");
const router = express.Router();
const fs = require("fs");
const knex = require("knex")(require("../knexfile").development);
const fetchUser = async () => {
  const getData = await knex("employee_list").then((data) => {
    return data;
  });
  return getData;
};

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  let userList = fetchUser()
    .then((data) => (userList = data))
    .then(() => {
      const found = userList.find((user) => user.id == id);
      if (found) {
        return res.status(200).send(found.avatar);
      } else {
        return res.status(400).send(null);
      }
    });
});

module.exports = router;
