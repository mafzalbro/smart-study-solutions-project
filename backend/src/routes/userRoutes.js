const express = require("express");
const router = express.Router();
const {
  //   createUser,
  getAllUsers,
  getUserBySlug,
  getUser,
  updateUserBySlug,
  deleteUserBySlug,
  deleteCurrentUser,
  updateUserById,
  getLikedResources,
  getAllAnswersByUser,
  getAllQuestionsByUser,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");
const { adminAuth } = require("../middlewares/adminAuth");

// // Route to create a new user
// router.post('/', createUser);

// Route to get all users

// router.get("/", getAllUsers);

// Route to delete current user
router.delete("/", auth, deleteCurrentUser);

// Liked Resources
router.get("/liked-resources", auth, getLikedResources);

// Asked Question
router.get("/asked-questions", auth, getAllQuestionsByUser);

// Answers
router.get("/given-answers", auth, getAllAnswersByUser);

router.get("/admin", adminAuth, getAllUsers);

// Route to get a user
router.get("/get/one", auth, getUser);


// Route to get a user by ID
// router.get('/:id', auth, getUserById);
router.get("/:slug", getUserBySlug);

// Route to update a user by ID
router.put("/:id", auth, updateUserById);

router.put("/update", adminAuth, updateUserBySlug);

// Route to delete a user by Slug
router.delete("/:slug", adminAuth, deleteUserBySlug);


module.exports = router;
