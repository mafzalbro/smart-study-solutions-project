const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker"); // Import faker
const Resource = require("../src/models/resource"); // Resource model
const { connect } = require("../src/config/db"); // DB connection file

// Connect to the database
connect();

// Function to generate fake resource data
const generateFakeResources = () => {
  const fakeResources = [];
  const count = 1000

  for (let i = 0; i < count; i++) {
    // Adjust the number of resources you want to generate
    const fakeResource = {
      title: faker.lorem.words(5),
      semester: faker.helpers.arrayElement([
        "semester 1",
        "semester 2",
        "semester 3",
        "semester 4",
        "semester 5",
        "semester 6",
        "semester 7",
        "semester 8",
      ]),
      degree: faker.helpers.arrayElement([
        "bsit",
        "bscs",
        "bsse",
        "bsee",
        "bsme",
        "bsce",
        "bsce_civil",
        "bsbio",
        "bsphysics",
        "bschemistry"
    ]),
      type: faker.helpers.arrayElement(["books", "notes", "past papers"]),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentences(3),
      profileImage: faker.image.avatar(),
      tags: [faker.lorem.word(), faker.lorem.word()],
      pdfLink: ['/javascript_operators.pdf'],
      status: faker.datatype.boolean(),
      ai_approval: faker.datatype.boolean(),
      rating: faker.number.int({ min: 0, max: 5 }),
      ratingCount: faker.number.int({ min: 0, max: 100 }),
      likes: faker.number.int({ min: 0, max: 100 }),
      dislikes: faker.number.int({ min: 0, max: 50 }),
      likedBy: ["66f4eb669ca841f42343eba5"], // Mock user IDs
      dislikedBy: [], // Mock user IDs
      ratings: [
        {
          userId: "66f4eb669ca841f42343eba5", // Mock user ID
          rating: faker.number.int({ min: 1, max: 5 }),
        },
      ],
    };

    fakeResources.push(fakeResource);
  }

  return fakeResources;
};

// Function to clean old data and insert new data
const insertFakeResources = async () => {
  try {
    // Clean old data from the 'Resource' collection
    await Resource.deleteMany({});
    console.log("Old resource data deleted successfully");

    // Generate fake resources data
    const fakeResources = generateFakeResources();

    // Insert new fake resources data
    await Resource.insertMany(fakeResources);
    console.log("Fake resources data inserted successfully");

    mongoose.connection.close(); // Close the connection after insertion
  } catch (error) {
    console.error("Error inserting resources data:", error);
    mongoose.connection.close();
  }
};

insertFakeResources();
