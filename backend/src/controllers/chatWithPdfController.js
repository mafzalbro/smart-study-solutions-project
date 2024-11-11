const User = require("../models/user");
const { extractTextFromPdf } = require("../utils/pdfUtils");
const { generateChatResponse } = require("../utils/chatUtils");
const { paginateResultsForArray } = require("../utils/pagination");
const { getAIMessage } = require("../utils/getAIMessage");

const createChatOption = async (req, res) => {
  const { title, pdfUrl } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in to continue." });
    }

    // Check if there is an existing empty chat
    let existingEmptyChatOption = user.chatOptions.find(
      (option) => option.chatHistory.length === 0
    );

    if (existingEmptyChatOption) {
      return res.status(200).json({
        message: "An empty chat already exists.",
        chatOption: existingEmptyChatOption,
      });
    }

    // If pdfUrl is provided, check if there is an existing chat with the same PDF URL
    if (pdfUrl) {
      let existingChatOptionWithPdfUrl = user.chatOptions.find(
        (option) => option.pdfUrls && option.pdfUrls.includes(pdfUrl)
      );

      if (existingChatOptionWithPdfUrl) {
        return res.status(200).json({
          message: "A chat with the same PDF URL already exists.",
          chatOption: existingChatOptionWithPdfUrl,
        });
      }
    }

    // Create a new chat
    const newChatOption = { title, chatHistory: [] };
    if (pdfUrl) {
      newChatOption.pdfUrls = [pdfUrl];
    }
    user.chatOptions.push(newChatOption);
    await user.save();

    // Fetch the newly added chat (assuming it's the last one added)
    const newlyAddedChatOption = user.chatOptions[user.chatOptions.length - 1];

    res.status(201).json({
      message: "chat created successfully",
      chatOption: newlyAddedChatOption,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllChatOptions = async (req, res) => {
  const { page = 1, limit = 5, sortBy, filterBy, query } = req.query;
  let filteredChatOptions = req.user.chatOptions;

  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in to continue." });
    }

    // Filtering
    if (filterBy) {
      const filter = JSON.parse(filterBy);
      filteredChatOptions = filteredChatOptions.filter((option) => {
        return Object.keys(filter).every((key) => {
          return option[key] === filter[key];
        });
      });
    }

    // Searching
    if (query) {
      const searchQuery = new RegExp(query, "i");
      filteredChatOptions = filteredChatOptions.filter((option) => {
        return (
          searchQuery.test(option.title) ||
          option.chatHistory.some(
            (chat) =>
              searchQuery.test(chat.user_query) ||
              searchQuery.test(chat.model_response)
          )
        );
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
    const results = paginateResultsForArray(
      filteredChatOptions,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getChatTitles = async (req, res) => {
  const { page = 1, limit = 5, sortBy, filterBy, query } = req.query;
  let filteredChatOptions = req.user.chatOptions;

  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in to continue." });
    }

    // Filtering
    if (filterBy) {
      const filter = JSON.parse(filterBy);
      filteredChatOptions = filteredChatOptions.filter((option) => {
        return Object.keys(filter).every((key) => {
          return option[key] === filter[key];
        });
      });
    }

    // Searching
    if (query) {
      const searchQuery = new RegExp(query, "i");
      filteredChatOptions = filteredChatOptions.filter((option) =>
        searchQuery.test(option.title)
      );
    }

    // Sorting by updatedAt descending (most recently updated first)
    filteredChatOptions.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Extracting titles based on pdfUrls or pdfText
    const titles = filteredChatOptions
      .filter((option) => option.pdfUrls.length === 0) // Include chats with pdfText
      .filter((option) => !option.pdfText)
      .map((option) => {
        const isPdf = option.pdfUrls.length > 0 || option.pdfText; // Check if it's a PDF title
        return {
          slug: option.slug,
          title: option.title,
          createdAt: option.createdAt,
          updatedAt: option.updatedAt,
          pdfUrls: isPdf ? option.pdfUrls : null, // Include pdfUrls only if it's a PDF
          pdfText: isPdf ? option.pdfText : null, // Include pdfText only if it's a PDF
        };
      });

    // Count total chats and PDFs
    const totalChats = filteredChatOptions.filter(
      (option) => option.pdfUrls.length === 0 && !option.pdfText
    ).length; // Chats without PDF or pdfText
    const totalPDFs = filteredChatOptions.filter(
      (option) => option.pdfUrls.length > 0 || option.pdfText
    ).length; // Chats with PDF or pdfText

    // Pagination
    const results = paginateResultsForArray(
      titles,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      ...results,
      totalChats,
      totalPDFs,
    });
  } catch (error) {
    console.error("Error fetching chat titles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPdfTitles = async (req, res) => {
  const { page = 1, limit = 5, sortBy, filterBy, query } = req.query;
  let filteredChatOptions = req.user.chatOptions;

  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in to continue." });
    }

    // Filtering
    if (filterBy) {
      const filter = JSON.parse(filterBy);
      filteredChatOptions = filteredChatOptions.filter((option) => {
        return Object.keys(filter).every((key) => {
          return option[key] === filter[key];
        });
      });
    }

    // Searching
    if (query) {
      const searchQuery = new RegExp(query, "i");
      filteredChatOptions = filteredChatOptions.filter((option) =>
        searchQuery.test(option.title)
      );
    }

    // Sorting by updatedAt descending (most recently updated first)
    filteredChatOptions.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Extracting titles with slugs, PDF URLs, and PDF text
    const titles = filteredChatOptions
      .filter((option) => option.pdfUrls.length > 0 || option.pdfText) // Include chats with pdfUrls or pdfText
      .map((option) => ({
        slug: option.slug,
        title: option.title,
        createdAt: option.createdAt,
        updatedAt: option.updatedAt,
        pdfUrls: option.pdfUrls,
        pdfText: option.pdfText,
      }));

    // Count total PDFs
    const totalPDFs = filteredChatOptions.filter(
      (option) => option.pdfUrls.length > 0 || option.pdfText
    ).length;

    // Pagination
    const results = paginateResultsForArray(
      titles,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      ...results,
      totalPDFs,
    });
  } catch (error) {
    console.error("Error fetching chat titles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const chatWithPdfBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { pdfUrl, pdfText, message, title } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).send("<p>Please log in to continue.</p>");
    }

    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send("<p>User not found. You must be logged in.</p>");
    }

    let chatOption;

    if (slug) {
      chatOption = user.chatOptions.find((option) => option.slug === slug);
      if (!chatOption) {
        return res.status(404).send("<p>Chat not found.</p>");
      }
    } else {
      chatOption = user.chatOptions[0];
    }

    const apiKey = user.apiKey;

    // Set chatOption title
    chatOption.title = title;

    if (pdfUrl) {
      // Add unique PDF URL to the list
      chatOption.pdfUrls = pdfUrl.includes("http")
        ? Array.from(new Set([...chatOption.pdfUrls, pdfUrl]))
        : Array.from(new Set([...chatOption.pdfUrls]));
    }

    let finalPdfText = pdfText;
    // Handle PDF text extraction if URL is provided
    if (pdfText) {
      chatOption.pdfText = pdfText;
    }
    if (pdfUrl) {
      chatOption.pdfText = ""; // Clear previous text if a new URL is provided
      finalPdfText = await extractTextFromPdf(pdfUrl); // Extract text from PDF
      chatOption.pdfText = finalPdfText; // Save extracted text
    } else if (!finalPdfText && chatOption.pdfText) {
      // If no pdfText in request body and chatOption has saved text
      finalPdfText = chatOption.pdfText;
    }

    const context = JSON.parse(JSON.stringify(chatOption.chatHistory)) || [];
    let initialMessage;

    // If there's a context and pdfText, add it to the context
    if (context.length > 0 && finalPdfText) {
      context[0].user_query += ` ___-------- (PDF Document Text: ${finalPdfText}) -----------`;
    } else if (finalPdfText) {
      // If no context, initialize with the PDF text
      initialMessage = `${message} -------- (PDF Document Text: ${finalPdfText}) -----------`;
    }

    // Generate chat response
    let responseStream;
    if (initialMessage) {
      responseStream = generateChatResponse(
        initialMessage,
        context,
        apiKey,
        finalPdfText,
        chatOption.googleCacheMetaData
      );
    } else {
      responseStream = generateChatResponse(
        message,
        context,
        apiKey,
        finalPdfText,
        chatOption.googleCacheMetaData
      );
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullResponse = "";
    for await (const chunkText of responseStream) {
      fullResponse += chunkText;
      res.write(chunkText);
    }

    // Save chat history after the response is sent
    chatOption.chatHistory.push({
      user_query: message,
      model_response: fullResponse,
    });

    // Attempt to save with retry logic
    let saveAttempt = 0;
    while (saveAttempt < 3) {
      try {
        await user.save();
        break; // Exit loop on success
      } catch (error) {
        if (error.name === "VersionError") {
          // Re-fetch user and retry if there's a version conflict
          user = await User.findById(userId);
          chatOption =
            user.chatOptions.find((option) => option.slug === slug) ||
            user.chatOptions[0];
          saveAttempt++;
          if (saveAttempt >= 3) {
            throw new Error("Failed to save after multiple attempts.");
          }
        } else {
          throw error;
        }
      }
    }

    res.end();
  } catch (error) {
    console.error("Error in chatWithPdfBySlug:", error);
    if (!res.headersSent) {
      res.status(500).send("<p>Internal server error</p>");
    }
  }
};

const updateChatOption = async (req, res) => {
  const { slug } = req.params;
  const { title, user_query, model_response } = req.body;

  console.log({ title });
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in to continue." });
    }
    if (!slug) {
      return res.status(200).json({ message: "Please provide chat slug" });
    }
    const chatOption = user.chatOptions.find((option) => option.slug === slug);

    if (!chatOption) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (title) {
      chatOption.title = title;
    }

    if (user_query && model_response) {
      chatOption.chatHistory.push({ user_query, model_response });
    }

    await user.save();

    res.status(200).json({ message: "chat updated successfully", chatOption });
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeChatOption = async (req, res) => {
  const { slug } = req.params;

  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in to continue." });
    }

    // Find the chat by slug
    const chatOptionIndex = user.chatOptions.findIndex(
      (option) => option.slug === slug
    );

    if (chatOptionIndex === -1) {
      return res.status(404).json({ message: "chat not found" });
    }

    // Remove the chat by index
    user.chatOptions.splice(chatOptionIndex, 1);
    await user.save();

    res.status(200).json({ message: "chat removed successfully" });
  } catch (error) {
    console.error("Error removing chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getChatOptionBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in to continue." });
    }

    const chatOption = user.chatOptions.find((option) => option.slug === slug);

    if (!chatOption) {
      return res.status(404).json({ message: "chat not found" });
    }

    res.status(200).json(chatOption);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setupAPIKey = async (req, res) => {
  const user = req.user;
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(404).json({ message: "API Key is not there" });
  }

  try {
    const message = await getAIMessage(
      apiKey,
      "testing, return me 'Cool, API Key is working!'"
    );
    if (message !== "try test again or add correct api key") {
      user.apiKey = apiKey;
      await user.save();
      return res
        .status(200)
        .json({ message: message.split("\n")[0].trim(), valid: true });
    } else {
      return res.status(404).json({
        message: "try test again or add correct api key",
        valid: false,
      });
    }
  } catch (error) {
    console.log("Error saving API Key", error);
    return res
      .status(500)
      .json({ message: "Internal server error", valid: false });
  }
};

const fetchAPIKey = async (req, res) => {
  const apiKey = req.user.apiKey;

  if (!apiKey) {
    return res.status(404).json({ message: "Please login" });
  }

  try {
    return res
      .status(200)
      .json({ message: "API retrieved successfully", apiKey });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createChatOption,
  updateChatOption,
  removeChatOption,
  getChatOptionBySlug,
  chatWithPdfBySlug,
  getAllChatOptions,
  getChatTitles,
  getPdfTitles,
  setupAPIKey,
  fetchAPIKey,
};
