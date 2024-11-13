const express = require("express");
const router = express.Router();
const {
  recommendResource,
  getResourceBySlug,
  addResource,
  updateResourceBySlug,
  deleteResourceBySlug,
  getAllResources,
  likeResource,
  dislikeResource,
  rateResource,
  getAllResourcesForUser,
  getGDrivePDFLink,
  downloadPDFResource,
  viewPDFResource,
} = require("../controllers/resourceController");

const { auth } = require("../middlewares/auth");
const { adminAuth } = require("../middlewares/adminAuth");

// Define routes
router.get("/", getAllResourcesForUser); // GET /?page=1&limit=5&sortBy=title&filterBy={"status":"active"}&query=keyword
// router.get('/recommend', auth, recommendResource);
router.get("/admin", adminAuth, getAllResources);
router.get("/recommend", recommendResource);
router.get("/:slug", getResourceBySlug);
router.get("/pdf/:slug", auth, getGDrivePDFLink);
router.get("/download-pdf/:slug", auth, downloadPDFResource);
router.get("/view-pdf/:slug", auth, viewPDFResource);
router.post("/add", adminAuth, addResource);
router.put("/:slug", adminAuth, updateResourceBySlug);
router.delete("/:slug", adminAuth, deleteResourceBySlug);
router.post("/:slug/like", auth, likeResource);
router.post("/:slug/dislike", auth, dislikeResource);
router.post("/:slug/rate", auth, rateResource);

module.exports = router;
