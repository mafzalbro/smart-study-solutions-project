// controllers/userController.js
const User = require('../models/user');
// const bcrypt = require('bcrypt');

// // Create a new user
// const createUser = async (req, res) => {
//   const { username, password, email, favoriteGenre } = req.body;
//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Create the user
//     const newUser = await User.create({
//       username,
//       password: hashedPassword,
//       email,
//       favoriteGenre
//     });
//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating user' });
//   }
// };

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // const users = await User.find({}, '-password -_id -__v');
    const users = await User.find({}, '-chatOptions -password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  // const { id } = req.params;
  const id = req.user.id;
  try {
    const user = await User.findById(id, '-chatOptions -password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update a user by ID
const updateUserById = async (req, res) => {
  // const { id } = req.params;
  const id = req.user.id;
  
  const { username, email, favoriteGenre } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      username,
      email,
      favoriteGenre
    }, { new: true, select: '-chatOptions -password -__v' });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  // const { id } = req.params;
  const id = req.user.id;
  
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  // createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
