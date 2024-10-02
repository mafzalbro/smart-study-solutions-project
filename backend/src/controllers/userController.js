// controllers/userController.js
const User = require('../models/user');
const { paginateResults } = require('../utils/pagination');
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
  const {page = 1, limit = 5} = req.query;
  try {
    // const users = await User.find({}, '-password -_id -__v');
    const users = User.find({}, '-chatOptions -password');
    const paginatedResults = await paginateResults(users, parseInt(page), parseInt(limit))
    res.status(200).json(paginatedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get a user by Slug
const getUserBySlug = async (req, res) => {
  const { slug } = req.params;
  // const id = req.user.id
  try {
    const user = await User.findOne({slug}, '-chatOptions -password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Get a user
const getUser = async (req, res) => {

  const id = req.user.id;

  console.log({id})
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

// Update a user by Slug
const updateUserBySlug = async (req, res) => {
  const { slug } = req.params;

  const user = await User.findOne({slug});

  const { username, fullname, email, favoriteGenre, role, profileImage } = req.body;
  
  try {
    if(!username){
      return res.status(404).json({ message: 'username not found' });
    }
    const updateData = {
      username,
      fullname,
      email,
      favoriteGenre,
      role
    };

    if (profileImage !== undefined) {
      // Process base64 encoded image string
      updateData.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true, select: '-chatOptions -password -__v' });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};


// Delete a user by Slug
const deleteUserBySlug = async (req, res) => {
  const { slug } = req.params;
  // const id = req.user.id;
  
  try {

    const user = await User.findOne({slug});

    const deletedUser = await User.findByIdAndDelete(user._id);

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
  getUserBySlug,
  getUser,
  updateUserBySlug,
  deleteUserBySlug
};
