
const express = require('express');
const router = express.Router();
const {
//   createUser,
  getAllUsers,
  getUserById,
  getUser,
  updateUserById,
  deleteUserById
} = require('../controllers/userController');
const { auth } = require('../middlewares/auth');
const { adminAuth } = require('../middlewares/adminAuth');


// // Route to create a new user
// router.post('/', createUser);

// Route to get all users
// router.get('/', adminAuth, getAllUsers);
router.get('/', adminAuth, getAllUsers);


// Route to get a user by ID
// router.get('/:id', auth, getUserById);
router.get('/:id', getUserById);

// Route to get a user
router.get('/get/one', auth, getUser);

// Route to update a user by ID
// router.put('/:id', auth, updateUserById);
router.put('/:id', updateUserById);

// Route to delete a user by ID
router.delete('/:id', auth, deleteUserById);

module.exports = router;
