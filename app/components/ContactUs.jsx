"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEmail, MdPerson, MdMessage } from 'react-icons/md';
import SubmitButton from '@/app/components/SubmitButton';
import TextInputField from '@/app/components/TextInputField';
import TextAreaField from '@/app/components/TextAreaField';
import WhiteContainer from './WhiteContainer';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email is not valid.';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        setErrors({});
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
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <SubmitButton
            onClick={handleSubmit}
            disabled={isSending || message === '' || email === '' || name === ''}
            processing={isSending}
          >
            {isSending ? 'Sending...' : 'Submit'}
          </SubmitButton>
        </form>
  );
};

export default ContactUs;
