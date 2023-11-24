const express = require("express");
const {
  accessChat,
  fetchChats ,
  createGroupChat ,
  renameGroup ,
  removeFromGroup ,
  addToGroup

} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(accessChat);
// router.route("/").get(protect, fetchChats);
// router.route("/group").post(protect, createGroupChat);
// router.route("/rename").put(protect, renameGroup);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);

module.exports = router;