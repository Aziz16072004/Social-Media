const { addMessage, getMessages,getLastMsg,addmsgLink } = require("../controller/messageController");
const router = require("express").Router();

router.post("/addmsg", addMessage);
router.post("/addmsgLink", addmsgLink);
router.post("/getmsg", getMessages);
router.get("/getLastMsg", getLastMsg);

module.exports = router;