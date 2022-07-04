const express = require("express");
// const app = express();
const router = express.Router();
const fs = require("fs");
const fetchUser = () => {
  return JSON.parse(fs.readFileSync("./data/employeeList.json"));
};

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const userList = fetchUser();
  const found = userList.find((user) => user.id == id);
  res.status(200).json(`${found.avatar}`);
});

module.exports = router;
