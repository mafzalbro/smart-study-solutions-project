"use client";

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/contact/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Subscribed successfully!');
        setEmail('');
      } else {
        toast.error('Failed to subscribe.');
      }
    } catch (error) {
      toast.error('Error subscribing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-neutral-100">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
        <p className="mb-5 text-neutral-300">Subscribe to our newsletter to stay updated.</p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 sm:mb-0 sm:mr-2 px-4 py-2 rounded-lg border border-neutral-600 bg-neutral-900 text-neutral-100 outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Your Email"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className={`bg-accent-600 text-neutral-100 py-2 px-4 rounded-lg hover:bg-accent-700 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default NewsletterSubscription;
