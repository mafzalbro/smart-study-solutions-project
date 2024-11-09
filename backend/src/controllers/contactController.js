// controllers/contactController.js
const Contact = require('../models/contact');
const User = require('../models/user');
const { sendGenericEmail } = require('../services/emailService'); // Adjust path as needed
const { paginateResults } = require('../utils/pagination');

const createContactMessage = async (req, res) => {
    try {
      const { email, name, message } = req.body;
  
      // Check if the email exists in the User collection
      const userExists = await User.findOne({ email });
  
      // Find if contact already exists for this email
      let contact = await Contact.findOne({ email });
  
      if (contact) {
        // If contact exists, update the names and messages arrays
        contact.names.push(name);
        contact.messages.push(message);
        contact.names = Array.from(new Set(contact.names)); // Ensure uniqueness
        contact.messages = Array.from(new Set(contact.messages)); // Ensure uniqueness
      } else {
        // If contact does not exist, create a new contact
        contact = new Contact({
          email,
          names: [name],
          messages: [message],
          known: !!userExists,
          userId: userExists ? userExists._id : null,
          fullname: userExists ? userExists.fullname : null,
        });
      }
  
      // Save the contact message
      await contact.save();
  
      // Send a generic email to the user
      await sendGenericEmail(email, "Thank you for your message", "We have received your message and will get back to you soon.");
  
      // Send a notification email to yourself
      const adminSubject = "New Mail on Smart Study Solutions";
      const adminMessage = `You have received a new contact message:
      Name: ${name}
      Email: ${email}
      Message: ${message}`;
  
      await sendGenericEmail("mafzalbro@gmail.com", adminSubject, adminMessage);
  
      res.status(201).json({ success: true, data: contact });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  
  const getAllContacts = async (req, res) => {
    const { page = 1, limit = 10, sortBy, filterBy, query } = req.query;
    
    let queryOptions = {};
    let sortOptions = {};
  
    try {
      // Parse sorting options
      if (sortBy) {
        const [field, direction] = sortBy.split(':');
        sortOptions[field] = direction === 'desc' ? -1 : 1;
      }
  
      // Parse filtering options
      if (filterBy) {
        try {
          const filter = JSON.parse(decodeURIComponent(filterBy));
          Object.assign(queryOptions, filter);
        } catch (error) {
          return res.status(400).json({ message: 'Invalid filterBy parameter' });
        }
      }
  
      // Parse search query
      if (query) {
        queryOptions.$or = [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } },
        ];
      }
  
      // Fetch results with pagination and sorting
      const results = await paginateResults(
        Contact.find(queryOptions).sort(sortOptions),
        parseInt(page),
        parseInt(limit)
      );
  
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching contacts', error: error.message });
    }
  };
  

const getContactByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('contacts');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const contacts = await Contact.find({ email: user.email });
    res.status(200).json({ success: true, data: contacts, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Find or create contact based on email
    let contact = await Contact.findOne({ email });

    if (!contact) {
      // If contact does not exist, create a new contact
      contact = new Contact({
        email,
        subscribed: true,
      });
    } else {
      // If contact exists, update the subscribed status
      contact.subscribed = true;
    }

    // Save the contact with updated subscribed status
    await contact.save();

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createContactMessage,
  getAllContacts,
  getContactByUserId,
  subscribeToNewsletter,
};
