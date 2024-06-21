const User = require('../models/user');
const { extractTextFromPdf } = require('../utils/pdfUtils');
const { generateChatResponse } = require('../utils/chatUtils');
const { paginateResultsForArray } = require('../utils/pagination');


const createChatOption = async (req, res) => {
  const { title } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    // Check if there is an existing empty chat option
    let existingEmptyChatOption = user.chatOptions.find(option => option.chatHistory.length === 0);

    if (existingEmptyChatOption) {
      return res.status(200).json({
        message: 'An empty chat option already exists.',
        chatOption: existingEmptyChatOption
      });
    }

    // Create a new chat option if no empty one exists
    const newChatOption = { title, chatHistory: [] };
    user.chatOptions.push(newChatOption);
    await user.save();

    // Fetch the newly added chat option (assuming it's the last one added)
    const newlyAddedChatOption = user.chatOptions[user.chatOptions.length - 1];

    res.status(201).json({
      message: 'Chat option created successfully',
      chatOption: newlyAddedChatOption
    });
  } catch (error) {
    console.error('Error creating chat option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllChatOptions = async (req, res) => {
  const { page = 1, limit = 5, sortBy, filterBy, query } = req.query;
  let filteredChatOptions = req.user.chatOptions;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    // Filtering
    if (filterBy) {
      const filter = JSON.parse(filterBy);
      filteredChatOptions = filteredChatOptions.filter(option => {
        return Object.keys(filter).every(key => {
          return option[key] === filter[key];
        });
      });
    }

    // Searching
    if (query) {
      const searchQuery = new RegExp(query, 'i');
      filteredChatOptions = filteredChatOptions.filter(option => {
        return searchQuery.test(option.title) || 
          option.chatHistory.some(chat => searchQuery.test(chat.user_query) || searchQuery.test(chat.model_response));
      });
    }

    // Sorting
    if (sortBy) {
      filteredChatOptions.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
    }

    // Pagination
    const results = paginateResultsForArray(filteredChatOptions, parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching chat options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllChatTitles = async (req, res) => {
  const { page = 1, limit = 5, sortBy, filterBy, query } = req.query;
  let filteredChatOptions = req.user.chatOptions;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    // Filtering
    if (filterBy) {
      const filter = JSON.parse(filterBy);
      filteredChatOptions = filteredChatOptions.filter(option => {
        return Object.keys(filter).every(key => {
          return option[key] === filter[key];
        });
      });
    }

    // Searching
    if (query) {
      const searchQuery = new RegExp(query, 'i');
      filteredChatOptions = filteredChatOptions.filter(option => searchQuery.test(option.title));
    }

    // Sorting
    if (sortBy) {
      filteredChatOptions.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
    }

    // Extracting titles
    const titles = filteredChatOptions.map(option => ({ id: option._id, title: option.title }));

    // Pagination
    const results = paginateResultsForArray(titles, parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching chat titles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const chatWithPdfById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { pdfUrl, message } = req.body;
    const userId = req?.user?.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    const chatOption = user.chatOptions.id(chatId);

    if (!chatOption) {
      return res.status(404).json({ message: 'Chat option not found' });
    }

    const pdfText = pdfUrl ? await extractTextFromPdf(pdfUrl) : '';
    const context = chatOption.chatHistory;
    const pdfContext = pdfText ? [{ user_query: `PDF Document Text: ${pdfText}`, model_response: '' }] : [];
    const combinedContext = [...context, ...pdfContext];

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Transfer-Encoding', 'chunked');

    const responseStream = generateChatResponse(message, combinedContext);

    let fullResponse = '';

    for await (const chunkText of responseStream) {
      fullResponse += chunkText;
      res.write(chunkText);
    }

    // Save full response to specific chat history
    chatOption.chatHistory.push({ user_query: message, model_response: fullResponse });
    await user.save();

    res.end();
  } catch (error) {
    console.error('Error in chatWithPdfById:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const updateChatOption = async (req, res) => {
  const { chatId } = req.params;
  const { title, user_query, model_response } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }
    if(!chatId){
      return res.status(200).json({message: 'Please provide chat id'})
    }
    const chatOption = user.chatOptions.id(chatId);

    if (!chatOption) {
      return res.status(404).json({ message: 'Chat option not found' });
    }

    if (title) {
      chatOption.title = title;
    }

    if (user_query && model_response) {
      chatOption.chatHistory.push({ user_query, model_response });
    }

    await user.save();

    res.status(200).json({ message: 'Chat option updated successfully', chatOption });
  } catch (error) {
    console.error('Error updating chat option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeChatOption = async (req, res) => {
  const { chatId } = req.params;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    // Find the chat option by ID
    const chatOptionIndex = user.chatOptions.findIndex(option => option._id.toString() === chatId);

    if (chatOptionIndex === -1) {
      return res.status(404).json({ message: 'Chat option not found' });
    }

    // Remove the chat option by index
    user.chatOptions.splice(chatOptionIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Chat option removed successfully' });
  } catch (error) {
    console.error('Error removing chat option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getChatOptionById = async (req, res) => {
  const { chatId } = req.params;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    const chatOption = user.chatOptions.id(chatId);

    if (!chatOption) {
      return res.status(404).json({ message: 'Chat option not found' });
    }

    res.status(200).json(chatOption);
  } catch (error) {
    console.error('Error fetching chat option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = { createChatOption, updateChatOption, removeChatOption, getChatOptionById, chatWithPdfById, getAllChatOptions, getAllChatTitles };
