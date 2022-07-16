const express = require("express");
const router = express.Router();
// BCRYPT//
const bcrypt = require("bcrypt");
const saltRounds = 10;
///
const knex = require("knex")(require("../knexfile"));
//
router.route("/").post((req, res) => {
  const data = req.body;
  const employeeInfo = {
    id: data.id,
    position: data.position,
    name: data.name,
    wage: data.wage,
    avatar: "/avatar/avatar(1).jpg",
    phone: data.phone,
    address: data.address,
  };
  knex("employee_list")
    .select("id", "name")
    .where({ id: data.id })
    .orWhere({ name: data.name })
    .then((data1) => {
      if (data1.length != 0) {
        return res
          .status(400)
          .send(`Duplicated with id: ${data1[0].id}, name: ${data1[0].name}`);
      } else {
        knex("employee_list")
          .insert(employeeInfo)
          .then((data2) => {
            const encryptPassword = async () => {
              try {
                await bcrypt.hash(data.password, saltRounds, (err, hash) => {
                  let loginInfo = {
                    id: data.id,
                    position: data.position,
                    password: hash,
                  };
                  knex("login")
                    .insert(loginInfo)
                    .catch((err) => {
                      console.log("login table error: ", err);
                      return res.status(400).send("An error has occured");
                    })
                    .then((res) => {});
                  return res.json("Success");
                });
              } catch (err) {
                console.log("Error when encrypting: ", err);
              }
            };
            encryptPassword();
          })
          .catch((err) => {
            console.log("employee_list error: ", err);
            return res.status(401).send("An error has occured");
          });
      }
    });
});

module.exports = router;
