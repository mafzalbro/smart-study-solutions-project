"use client";

import { useState, useEffect } from "react";
import { fetcher } from "../../utils/fetcher";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function WhatsAppUtility() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/whatsapp/generate-qr`
        );
        setQrCodeUrl(response.qrCodeUrl);
        setIsAuthenticated(response.isAuthenticated); // Set the authentication status from response
      } catch (error) {
        console.error("Error fetching QR code:", error);
      }
    };

    fetchQrCode();
  }, []);

  console.log({ phone, message });

  const handleSendMessage = async () => {
    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/whatsapp/send-message`,
        "POST",
        {
          to: phone,
          message,
        }
      );

      if (response.data.success) {
        // alert("Message sent and stored!");
      } else {
        // alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // alert("Error sending message.");
    }
  };

  return (
    <div>
      <h1>WhatsApp Utility</h1>

      {!isAuthenticated && (!!qrCodeUrl ? "" : <div>Loading...</div>)}

      {!isAuthenticated && qrCodeUrl && (
        <div>
          <p>Scan the QR code with your WhatsApp to log in:</p>
          <img src={qrCodeUrl} alt="QR Code for WhatsApp Web" />
        </div>
      )}

      {isAuthenticated && (
        <div className="flex flex-col">
          <h2>Send a Message</h2>
          <PhoneInput
            international
            defaultCountry="PK"
            value={phone}
            onChange={setPhone}
          />
          {/* <input
            // international
            // defaultCountry="PK"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          /> */}
          <textarea
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button onClick={handleSendMessage}>Send Message</button>
        </div>
      )}
    </div>
  );
}
