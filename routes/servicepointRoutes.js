const express = require("express");
const servicepointController = require("../controllers/servicepointController");

const router = express.Router();

router.get("/getservicepoint/:id", servicepointController.getservicepoint);
router.get(
  "/getfoodservicepoint/:id",
  servicepointController.getfoodservicepoint
);
//to get all categories for filter
router.get("/getspmcategories/:id", servicepointController.getspmcategories);
router.get("/getfscategories/:eventid", servicepointController.getfscategories);
router.get("/getfpmcategories/:id", servicepointController.getfpmcategories);

//to get on the basis of categories
router.get(
  "/foodpointbycategory/:eventid/category/:cat",
  servicepointController.foodpointsbycategory
);
router.get(
  "/menubycategory/:id/category/:cat",
  servicepointController.menubycategory
);
router.get(
  "/foodmenubycategory/:id/category/:cat",
  servicepointController.foodmenubycategory
);

//to download menu pdf
router.get("/downloadmenu/:filename", servicepointController.download);
// router.get("/getcategories/:id", servicepointController.getcategories);
module.exports = router;
