// controllers/userController.js
const User = require("../models/user");
const Resource = require("../models/resource");
const { paginateResults, paginateResultsForArray } = require("../utils/pagination");
const Question = require("../models/qna");

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
  const { page = 1, limit = 5, query = "" } = req.query;
  try {
    // Build the search query if the query term exists
    const searchQuery = query
      ? {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const users = User.find(searchQuery, "-chatOptions -password");
    // const users = await User.find({}, '-password -_id -__v');
    const paginatedResults = await paginateResults(
      users,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json(paginatedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get a user by Slug
const getUserBySlug = async (req, res) => {
  const { slug } = req.params;
  // const id = req.user.id
  try {
    const user = await User.findOne({ slug }, "-chatOptions -password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Get a user
const getUser = async (req, res) => {
  const id = req.user.id;

  console.log({ id });
  try {
    const user = await User.findById(id, "-chatOptions -password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update a user by Slug
const updateUserBySlug = async (req, res) => {
  const { slug } = req.params;

  const user = await User.findOne({ slug });

  const { username, fullname, email, favoriteGenre, role, profileImage } =
    req.body;

  try {
    if (!username) {
      return res.status(404).json({ message: "username not found" });
    }
    const updateData = {
      username,
      fullname,
      email,
      favoriteGenre,
      role,
    };

    if (profileImage !== undefined) {
      // Process base64 encoded image string
      updateData.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
      select: "-chatOptions -password -__v",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Update a user by Slug
const updateUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const { username, fullname, email, favoriteGenre, role, profileImage } =
    req.body;

  try {
    if (!username) {
      return res.status(404).json({ message: "username not found" });
    }
    const updateData = {
      username,
      fullname,
      email,
      favoriteGenre,
      role,
    };

    if (profileImage !== undefined) {
      // Process base64 encoded image string
      updateData.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
      select: "-chatOptions -password -__v",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete a user by Slug
const deleteUserBySlug = async (req, res) => {
  const { slug } = req.params;
  // const id = req.user.id;

  try {
    const user = await User.findOne({ slug });

    const deletedUser = await User.findByIdAndDelete(user._id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
// Controller to get all liked resources by a user
const getLikedResources = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Fetch all liked resources by the user with pagination
    const likedResourcesQuery = Resource.find({
      likedBy: req.user.id,
    }).populate("likedBy", "username profileImage");

    const paginatedResults = await paginateResults(
      likedResourcesQuery,
      parseInt(page),
      parseInt(limit)
    );

    // If no liked resources are found
    if (paginatedResults.data.length === 0) {
      return res.status(404).json({ message: "No liked resources found" });
    }

    return res.status(200).json(paginatedResults);
  } catch (error) {
    console.error("Error fetching liked resources:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

// Controller to get all answers by the user along with the associated question
const getAllAnswersByUser = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Fetch all questions where the user has answered
    const questionsWithAnswers = await Question.find({
      "answers.answeredBy": req.user.id,
    })
      // .populate({
      //   path: "answers.answeredBy",
      //   select: "username profileImage", // Populate the user info for the answer
      // })
      // .exec();

    // Flatten the array of answers to just return answers by the user
    const answersByUser = questionsWithAnswers.reduce((answers, question) => {
      // Filter out the answers where the user is the one who answered
      const answersForUser = question.answers.filter(
        (answer) => answer.answeredBy.toString() === req.user.id.toString()
      );

      // Add the question text and other relevant information to each answer
      const answersWithQuestion = answersForUser.map((answer) => ({
        ...answer.toObject(),
        questionText: question.question, // Add the question text
        questionSlug: question.slug, // Add the question's slug for reference
      }));

      return answers.concat(answersWithQuestion);
    }, []);

    // Paginate the answers
    const paginatedResults = await paginateResultsForArray(
      answersByUser,
      parseInt(page),
      parseInt(limit)
    );

    // If no answers are found
    if (paginatedResults.data.length === 0) {
      return res
        .status(404)
        .json({ message: "No answers found for this user" });
    }

    // Return the list of answers by the user, with the associated question details
    return res.status(200).json(paginatedResults);
  } catch (error) {
    console.error("Error fetching answers by user:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

// Controller to get all questions asked by the user
const getAllQuestionsByUser = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Fetch all questions where the user is the one who asked
    const questionsQuery = Question.find({ askedBy: req.user.id }).select('question slug createdAt')
    
    // .populate(
    //   "askedBy",
    //   "username profileImage"
    // );

    const paginatedResults = await paginateResults(
      questionsQuery,
      parseInt(page),
      parseInt(limit)
    );

    // If no questions are found
    if (paginatedResults.data.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this user" });
    }

    // Return the questions
    return res.status(200).json(paginatedResults);
  } catch (error) {
    console.error("Error fetching questions by user:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

module.exports = {
  // createUser,
  getAllUsers,
  getUserBySlug,
  getUser,
  updateUserById,
  updateUserBySlug,
  deleteUserBySlug,
  getLikedResources,
  getAllAnswersByUser,
  getAllQuestionsByUser,
};
