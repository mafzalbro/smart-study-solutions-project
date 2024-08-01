"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEmail, MdPerson, MdMessage } from 'react-icons/md';
import SubmitButton from '@/app/components/SubmitButton';
import TextInputField from '@/app/components/TextInputField';
import TextAreaField from '@/app/components/TextAreaField';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill out all fields.');
      setIsSending(false);
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
        toast.success('Message sent successfully.');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      toast.error('Error sending message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 bg-secondary dark:bg-neutral-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <MdPerson className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500" size={20} />
            <TextInputField
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              label="Name"
              className="pl-12"
              required={true}
            />
          </div>
          <div className="relative">
            <MdEmail className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500" size={20} />
            <TextInputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              label="Email"
              className="pl-12"
              required={true}
            />
          </div>
          <div className="relative">
            <MdMessage className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500" size={20} />
            <TextAreaField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              label="Message"
              className="pl-12"
              rows="4"
              required={true}
            />
          </div>
          <SubmitButton
            onClick={handleSubmit}
            disabled={isSending || message === '' || email === '' || message === ''}
            processing={isSending}
          >
            {isSending ? 'Sending...' : 'Submit'}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
