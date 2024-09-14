const Notification = require("../models/notification");
const User = require("../models/user");

const readAllNotifications = async (req, res) => {
  try {
    const userId = req.query.user;
    const user = await User.findById(userId)
    if (!user) {
      return res.json("user not exist")
    }
    user.newNotifi = 0
    user.save()
    res.json("update successfuly");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const readOneNotification = async (req, res) => {
  try {
    const IdNotifi = req.query.notifi;
    const notification = await Notification.findById(IdNotifi)
    if (!notification) {
      return res.json("notifcation not exist")
    }
    notification.read = true
    notification.save()
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const getNotifications = async (req, res) => {
  try {
    const receiverId = req.query.receiver;
    const notifications = await Notification.find({
      receiver: receiverId
    }).populate({
        path : "sender",
        model : "User" ,
        select : "username profileImg -_id"
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getNotifications , readAllNotifications , readOneNotification};
