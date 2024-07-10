const User = require('../models/user');
const { extractTextFromPdf } = require('../utils/pdfUtils');
const { generateChatResponse } = require('../utils/chatUtils');
const { paginateResultsForArray } = require('../utils/pagination');
const { getAIMessage } = require('../utils/getAIMessage');

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

    // Sorting by updatedAt descending (most recently updated first)
    filteredChatOptions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Extracting titles with slugs
    const titles = filteredChatOptions.map(option => ({
      slug: option.slug,
      title: option.title,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt
    }));

    // Pagination
    const results = paginateResultsForArray(titles, parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching chat titles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const chatWithPdfBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { pdfUrl, message, title } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).send('<p>Please log in to continue.</p>');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('<p>User not found. You must be logged in.</p>');
    }

    let chatOption;

    if (slug) {
      chatOption = user.chatOptions.find(option => option.slug === slug);
      if (!chatOption) {
        return res.status(404).send('<p>Chat option not found.</p>');
      }
    } else {
      chatOption = user.chatOptions[0];
    }

    // Check for API key
    const apiKey = user.apiKey;
    if (!apiKey) {
      // If no API key, redirect to /chat/test in a new tab
      return res.send('<p>Please <a href="/chat/test" style="color: lightblue;" target="_blank">Enter API Key</a></p>');
    }

    // Update chatOption with title and pdfUrls
    chatOption.title = title;
    chatOption.pdfUrls = pdfUrl.includes("http") ? Array.from(new Set([...chatOption.pdfUrls, pdfUrl])) : Array.from(new Set([...chatOption.pdfUrls]));

    let pdfText = '';

    // If PDF URL is provided, extract text and save it to chatOption
    if (pdfUrl) {
      chatOption.pdfText = '';
      pdfText = await extractTextFromPdf(pdfUrl);
      chatOption.pdfText = pdfText;
    } else if (chatOption.pdfText) {
      // Use existing pdfText if no new PDF URL is provided
      pdfText = chatOption.pdfText;
    }

    const context = [...chatOption.chatHistory] || [];

    let initialMessage;
    
    // If context has entries, update the first user query with pdfText
    if (context.length > 0 && pdfText) {
      context[0].user_query += ` -------- (PDF Document Text: ${pdfText}) -----------`;
    }else if(pdfText){
      initialMessage = `${message} -------- (PDF Document Text: ${pdfText}) -----------`;
    }

    let responseStream;

    if(initialMessage){
      // Generate response with updated context or just message if context is empty
      responseStream = generateChatResponse(initialMessage, context, apiKey);
    } else{
      responseStream = generateChatResponse(message, context, apiKey);
    }
      
    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Send streaming response
    let fullResponse = '';

    for await (const chunkText of responseStream) {
      fullResponse += chunkText;
      res.write(chunkText); // Stream chunk to client
    }

    // Add new chat entry to chatHistory
    chatOption.chatHistory.push({ user_query: message, model_response: fullResponse });

    // Save chatOption back to user's chatOptions array
    await user.save();

    res.end(); // End the streaming response
  } catch (error) {
    console.error('Error in chatWithPdfBySlug:', error);

    if (!res.headersSent) {
      // Send HTML error response
      res.status(500).send('<p>Internal server error</p>');
    }
  }
};



const updateChatOption = async (req, res) => {
  const { slug } = req.params;
  const { title, user_query, model_response } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }
    if(!slug){
      return res.status(200).json({message: 'Please provide chat slug'})
    }
    const chatOption = user.chatOptions.find(option => option.slug === slug);

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
  const { slug } = req.params;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    // Find the chat option by slug
    const chatOptionIndex = user.chatOptions.findIndex(option => option.slug === slug);

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

const getChatOptionBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in to continue.' });
    }

    const chatOption = user.chatOptions.find(option => option.slug === slug);

    if (!chatOption) {
      return res.status(404).json({ message: 'Chat option not found' });
    }

    res.status(200).json(chatOption);
  } catch (error) {
    console.error('Error fetching chat option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const setupAPIKey = async (req, res) => {
  const user = req.user;
  const { apiKey } = req.body

  if(!apiKey){
    return res.status(404).json({ message: "API Key is not there" })
  }
  
  try{
    const message = await getAIMessage(apiKey, "testing, return me 'Cool, API Key is working!'")
    if(message !== "try test again or add correct api key"){
      user.apiKey = apiKey
      await user.save()
      return res.status(200).json({ message: message.split("\n")[0].trim(), valid: true })
    } else{
      return res.status(404).json({ message: "try test again or add correct api key", valid: false })
    }

  } catch(error){
    console.log("Error saving API Key", error)
    return res.status(500).json({ message: 'Internal server error', valid: false })
  }
}

const fetchAPIKey = async (req, res) => {
  const apiKey = req.user.apiKey;
  
  if (!apiKey) {
    return res.status(404).json({ message: "Please login" });
  }

  try {
    return res.status(200).json({ message: "API retrieved successfully", apiKey });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createChatOption, updateChatOption, removeChatOption, getChatOptionBySlug, chatWithPdfBySlug, getAllChatOptions, getAllChatTitles, setupAPIKey, fetchAPIKey };
