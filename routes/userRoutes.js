const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.get("/confirm/:confirmationCode", authController.verifyUser);
router.post("/login", authController.login);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.get("/myqrcode", authController.protect, userController.generateQR);
//not consumed in front end
router.get(
  "/profiledata",
  authController.protect,
  userController.getprofiledata
);

// router.delete('/deleteMe', authController.protect, userController.deleteMe);

module.exports = router;
