"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/app/utils/fetcher';
import Link from 'next/link';

const Pricing = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('JazzCash'); // Default to JazzCash

  // Redirect to JazzCash payment page
  const handlePayment = async (amount, description) => {
    // try {
      const data = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/payments/jazzcash`, 'POST', {
        amount,
        description,
        paymentMethod, // Pass the selected payment method
        customerMobile: '03001234567', // Replace with actual customer mobile
      })
      if (data) {
        router.push(data.paymentUrl); // Redirect to JazzCash or Bank transfer payment URL
      } else {
        alert('Payment failed: ' + data.message);
      }
    // } catch (error) {
    //   console.error('Payment error: ', error);
    // }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Version */}
        <div className="bg-secondary dark:bg-accent-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Free Version</h2>
          <p>Limited access to AI chat (20 chats/day)</p>
          <p>Access 2 documents per day</p>
          <p>Limited access to the Q&A forum</p>
          <div className="mt-6">
            <Link href='/'
              className="bg-gray-500 text-white py-2 px-4 rounded-full"
            >
              Continue for Free
            </Link>
          </div>
        </div>

        {/* Paid Version */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Paid Version</h2>
          <p>Unlimited access to AI chat</p>
          <p>Unlimited PDF downloads</p>
          <p>Access to the Q&A forum with teacher's answers</p>

          {/* Payment Method Selection */}
          <div className="my-4">
            <label className="block text-gray-700 mb-2">Choose Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="block w-full bg-gray-200 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white"
            >
              <option value="JazzCash">JazzCash Wallet</option>
              <option value="Bank">Bank Transfer</option>
              <option value="Easypaisa">Easypaisa</option>
              <option value="UPaisa">UPaisa</option>
            </select>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handlePayment(1000, 'Paid Membership')}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Get Membership (PKR 1000)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
