const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

const scheduleRoute = require("./routes/schedule");
app.use(express.json());
app.use(cors());
app.use("/schedule", scheduleRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
