const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

const scheduleRoute = require("./routes/schedule");
const loginRoute = require("./routes/login");
const miscRoute = require("./routes/misc");
const addNewEditRoute = require("./routes/addnew-edit");

app.use(express.json());
app.use(cors());
app.use("/schedule", scheduleRoute);
app.use("/login", loginRoute);
app.use("/", addNewEditRoute);
app.use("/", miscRoute);
app.use("/avatar", express.static("data/avatar"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
