const express = require("express");
const router = express.Router();
const fs = require("fs");
const fetchUser = () => {
  return JSON.parse(fs.readFileSync("./data/employeeList.json"));
};

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const userList = fetchUser();
  const found = userList.find((user) => user.id == id);
  if (found) {
    return res.status(200).send(found.avatar);
  } else {
    return res.status(400).send(null);
  }
});

module.exports = router;
