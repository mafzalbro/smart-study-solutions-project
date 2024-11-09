"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { fetcher } from "@/app/utils/fetcher";

// Initialize Stripe outside of the component to avoid reloading on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for subscription status based on URL query parameters
    const type = searchParams.get("type");
    if (type === "success") {
      toast.success("Subscription successful!");
    } else if (type === "cancel") {
      toast.error("Subscription was cancelled.");
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/payments/create-checkout-session`,
        "POST"
      );

      if (data.sessionId) {
        // Load Stripe and redirect to Checkout
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });

          if (error) {
            console.error("Error redirecting to checkout:", error);
            toast.error(error.message);
          }
        }
      } else {
        console.error("No session ID returned from backend.");
        toast.error("Error creating checkout session.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Error initiating checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Join Our Membership
      </h1>

      {/* Card Section */}
      <div className="flex justify-center gap-8">
        {/* Free Version */}
        <div className="bg-secondary dark:bg-neutral-800 shadow-lg rounded-lg p-6 w-72">
          <h2 className="text-xl font-semibold text-center mb-4">
            Free Version
          </h2>
          <p className="text-neutral-700 dark:text-neutral-100 mb-2">
            Limited access to AI chat (20 chats/day)
          </p>
          <p className="text-neutral-700 dark:text-neutral-100 mb-2">Access 2 documents per day</p>
          <p className="text-neutral-700 dark:text-neutral-100 mb-4">Limited access to the Q&A forum</p>
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="bg-gray-950 text-white py-3 mt-2 px-4 rounded-full hover:bg-gray-600 transition duration-300"
            >
              Continue for Free
            </Link>
          </div>
        </div>

        {/* Paid Version */}
        <div className="bg-accent-600 text-white shadow-lg rounded-lg p-6 w-72">
          <h2 className="text-xl font-semibold text-center mb-4">
            Paid Version
          </h2>
          <p className="mb-2">Unlimited access to AI chat</p>
          <p className="mb-2">Unlimited PDF downloads</p>
          <p className="mb-4">Access to the Q&A forum with teacher's answers</p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-3 text-lg rounded-lg ${
              loading ? "bg-neutral-500" : "bg-accent-700 hover:bg-accent-800"
            }`}
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
