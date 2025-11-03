const express = require("express");
const app = express();

app.use("/role", require("./roleRoute"));
app.use("/user", require("./userRoute"));
app.use("/event", require("./eventRoute"));

module.exports = app;