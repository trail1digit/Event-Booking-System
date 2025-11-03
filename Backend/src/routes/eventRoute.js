const express = require("express");
const route = express.Router();
const eventController = require("../controllers/eventController");
const verifyToken = require("../utils/auth");

route.post("/addEvent", verifyToken, eventController.addEvent);
route.get("/listEvent", verifyToken, eventController.listEvent);
route.get("/eventById/:id", verifyToken, eventController.eventById);
route.put("/updateEvent/:id", verifyToken, eventController.updateEvent);
route.post("/bookEvent", verifyToken, eventController.bookEvent);
route.get("/bookEventList", verifyToken, eventController.bookEventList);
route.get(
  "/getGlobalAnalytics",
  verifyToken,
  eventController.getGlobalAnalytics
);

module.exports = route;
