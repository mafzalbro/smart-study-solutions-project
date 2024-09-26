const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Import faker
const Category = require('../src/models/category'); // Assuming the model is saved here
const { connect } = require('../src/config/db'); // Your DB config file

// Connect to the database
connect();

const createCategories = async () => {
  try {
    // Create an array to hold the category objects
    const categories = [];

    // Generate 10 categories with Faker
    for (let i = 0; i < 10; i++) {
      const category = {
        name: faker.lorem.word(), // Generate random description using Faker
        slug: faker.lorem.slug(), // Generate random description using Faker
        description: faker.lorem.sentence() // Generate random description using Faker
        // Leave out 'name' and 'slug' so Mongoose will use default values
      };
      categories.push(category);
    }

    await Category.deleteMany({})

    // Insert the categories into the database
    await Category.insertMany(categories);
    console.log('Categories created successfully');

    mongoose.connection.close(); // Close the connection after insertion
  } catch (error) {
    console.error('Error creating categories:', error);
  }
};

createCategories();
