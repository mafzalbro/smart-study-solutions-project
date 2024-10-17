const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Import faker
const Question = require('../src/models/qna'); // Assuming your Question model is located here
const { connect } = require('../src/config/db'); // Database connection file

// Database connection
connect();

// Function to generate fake question data
const generateFakeData = () => {
  const fakeQuestions = [];

  for (let i = 0; i < 10; i++) { // Adjust the number of questions you want to insert
    const fakeQuestion = {
      question: faker.lorem.sentence(),
      askedBy: "670f561203250c343930d6f0", // Mock user ID
      category: faker.helpers.arrayElement([
        "670f561203250c343930d6f0",
        "66f4ef43afcbf6946858ef82",
        "66f4ef43afcbf6946858ef83",
        "66f4ef43afcbf6946858ef84",
        "66f4ef43afcbf6946858ef85",
        "66f4ef43afcbf6946858ef86",
        "66f4ef43afcbf6946858ef87",
        "66f4ef43afcbf6946858ef88",
        "66f4ef43afcbf6946858ef89",
        "66f4ef43afcbf6946858ef8a"
    ]),
      tags: [faker.lorem.word(), faker.lorem.word()],
      slug: faker.lorem.slug(),
      answers: [
        {
          answerText: faker.lorem.paragraph(),
          answeredBy: "66f4eb669ca841f42343eba5", // Mock user ID
          upvotedBy: ["66f4eb669ca841f42343eba5",],
          downvotedBy: [],
          reports: [
            {
              reportedBy: "66f4eb669ca841f42343eba5",
              description: faker.lorem.sentence(),
            },
          ],
        },
      ],
      upvotedBy: ["66f4eb669ca841f42343eba5"],
      downvotedBy: [],
      reports: [
        {
          reportedBy: "66f4eb669ca841f42343eba5",
          description: faker.lorem.sentence(),
        },
      ],
      createdAt: faker.date.past(),
    };

    fakeQuestions.push(fakeQuestion);
  }

  return fakeQuestions;
};

// Function to clean old data and insert new data
const insertFakeData = async () => {
  try {
    // Clean old data
    await Question.deleteMany({}); // This will delete all records from the collection
    console.log('Old data deleted');

    // Insert new fake data
    const fakeQuestions = generateFakeData();
    await Question.insertMany(fakeQuestions);
    console.log('Fake data inserted successfully');
    
    mongoose.connection.close(); // Close the connection after inserting
  } catch (error) {
    console.error('Error inserting fake data:', error);
    mongoose.connection.close();
  }
};

insertFakeData();
