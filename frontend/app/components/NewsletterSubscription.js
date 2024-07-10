"use client"

import { useState } from 'react';
import AlertMessage from './AlertMessage';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
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
        setAlertMessage({ message: 'Subscribed successfully!', type: 'success' });
        setEmail('');
      } else {
        setAlertMessage({ message: 'Failed to subscribe.', type: 'error' });
      }
    } catch (error) {
      setAlertMessage({ message: 'Error subscribing.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => setAlertMessage(null);

  return (
    <div className="text-white pb-20 pt-10">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-bold mb-4">Newsletter</h3>
        <p className="mb-4">Subscribe to our newsletter to stay updated.</p>
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 md:mb-0 md:mr-2 px-3 py-2 outline-none focus:ring-orange-600 rounded-lg text-black"
            placeholder="Your Email"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className={`bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {alertMessage && <AlertMessage message={alertMessage.message} type={alertMessage.type} onClose={closeAlert} />}
      </div>
    </div>
  );
};

export default NewsletterSubscription;
