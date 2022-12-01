const express = require("express");
const servicepointController = require("../controllers/servicepointController");

const router = express.Router();

router.get("/getservicepoint/:id", servicepointController.getservicepoint);
router.get(
  "/getfoodservicepoint/:id",
  servicepointController.getfoodservicepoint
);
router.get(
  "/foodpointbycategory/category/:catid",
  servicepointController.foodpointsbycategory
);

router.get(
  "/menubycategory/:id/category/:catid",
  servicepointController.menubycategory
);
router.get(
  "/foodmenubycategory/:id/category/:catid",
  servicepointController.foodmenubycategory
);

// router.get(
//   "/getfoodservicepoint/:id",
//   servicepointController.getfoodservicepoint
// );
//download service point menu
router.get("/downloadmenu/:filename", servicepointController.download);
module.exports = router;
