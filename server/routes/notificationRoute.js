const express = require("express")
const router = express.Router()
const notificationController  = require('../controller/notificationController')

router.get("/getNotification" , notificationController.getNotifications)
router.post("/readAllNotifications" , notificationController.readAllNotifications)
router.post("/readOneNotification" , notificationController.readOneNotification)


module.exports = router
