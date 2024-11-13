"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { fetcher } from "@/app/utils/fetcher";
import { useAuth } from "@/app/customHooks/AuthContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SubscribePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const session_id = searchParams.get("session_id");

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/payments/create-checkout-session`,
        "POST"
      );

      if (data.sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
          if (error) {
            console.error("Error redirecting to checkout:", error);
          }
        }
      } else {
        console.error("No session ID returned from backend.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (type === "success" && session_id) {
    return (
      <div className="container mx-auto px-4 py-8 my-32">
        <div className="bg-green-200 text-primary dark:bg-green-800 dark:text-secondary p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Subscription Successful!</h2>
          <p>Your subscription is now active. Thank you for joining!</p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white py-3 px-6 mt-4 rounded-full hover:bg-gray-700 transition duration-300"
          >
            Continue
          </Link>
        </div>
      </div>
    );
  }

  if (type === "cancel") {
    return (
      <div className="container mx-auto px-4 py-8 my-32">
        <div className="bg-red-200 text-primary dark:bg-red-800 dark:text-secondary p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Subscription Cancelled</h2>
          <p>Your subscription attempt was cancelled. Please try again.</p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-lg text-lg ${
              loading
                ? "bg-neutral-500 cursor-not-allowed"
                : "bg-red-300 dark:bg-red-200 dark:text-primary hover:bg-red-400 dark:hover:bg-secondary"
            } transition-all duration-300`}
          >
            {loading ? "Processing..." : "Try Again! Subscribe"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
        {user?.isMember ? "You are Already a Member" : "Become a Member"}
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-6 w-80 transition transform hover:scale-105 duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Free Version
          </h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
            <li>• Limited access to AI chat (10 queries/every 2 hours)</li>
            <li>
              • Access 2 documents in every 2 hours i.e. 2 chat can be created
            </li>
            <li>• Can't see any notes</li>
            <li>• Limited access to Q&A forum (Can't see teacher's answers)</li>
          </ul>
          <Link
            href="/"
            className="block text-center bg-gray-900 text-white py-3 rounded-full hover:bg-gray-700 transition duration-300"
          >
            Continue for Free
          </Link>
        </div>

        <div className="bg-blue-600 text-white shadow-lg rounded-lg p-6 w-80 transition transform hover:scale-105 duration-300">
          <h2 className="text-2xl font-semibold mb-4">Premium Access</h2>
          <ul className="space-y-2 mb-6">
            <li>• Unlimited access to AI chat</li>
            <li>• Unlimited PDF downloads</li>
            <li>• Full access to Q&A forum (Can see teachers answers)</li>
            <li>• Can access all notes</li>
          </ul>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-3 rounded-full text-lg ${
              loading
                ? "bg-blue-500 cursor-not-allowed"
                : "bg-accent-900 hover:bg-accent-700"
            } transition-all duration-300`}
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
