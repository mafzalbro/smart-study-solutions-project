"use client"

import { useState } from 'react';
import useAlert from '../customHooks/useAlert'; // Adjust the path as per your project structure

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Initialize useAlert hook
  const [alertMessage, setAlertMessage] = useAlert('', 5000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true); // Set isSending to true when form is being submitted
    
    // Validate fields
    if (!name.trim() || !email.trim() || !message.trim()) {
      setAlertMessage('Please fill out all fields.');
      setIsSending(false); // Reset isSending on validation failure
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setAlertMessage('Message sent successfully.');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setAlertMessage('Failed to send message.');
      }
    } catch (error) {
      setAlertMessage('Error sending message.');
    } finally {
      setIsSending(false); // Reset isSending after request completes (success or failure)
    }
  };

  return (
    <div className="my-16">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 rounded-lg shadow-md ring-orange-200">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="Your Name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="Your Email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 max-h-52 min-h-52"
            rows="4"
            placeholder="Your Message"
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isSending} // Disable button while isSending is true
            className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            {isSending ? 'Sending...' : 'Submit'} {/* Show 'Sending...' text while isSending is true */}
          </button>
        </div>
      </form>

      {/* Display alert message */}
      {alertMessage && (
        <div className={`fixed bottom-5 right-5 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-50`}>
          <p className="text-sm">{alertMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
