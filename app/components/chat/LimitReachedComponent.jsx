import React, { useEffect, useState } from "react";
import Link from "next/link";

const LimitReachedComponent = ({
  userChatInfo,
  inputArea,
  setUserChatInfo,
  newButton,
  fetchChatInfo,
  pdfUrls,
}) => {
  const [timeLeft, setTimeLeft] = useState(null);

  console.log({ pdfUrls });

  useEffect(() => {
    if (userChatInfo) {
      if (userChatInfo?.lastResetDate) {
        const interval = setInterval(() => {
          const currentTime = new Date();
          const lastReset = new Date(userChatInfo.lastResetDate);
          const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
          const timeElapsed = currentTime - lastReset;

          if (timeElapsed < twoHours) {
            const remainingTime = twoHours - timeElapsed;
            const minutesLeft = Math.floor(remainingTime / 60000);
            const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
            setTimeLeft(`${minutesLeft}m ${secondsLeft}s`);
          } else {
            setTimeLeft("Time Out Ended");
          }
        }, 1000);

        if (timeLeft == "Time Out Ended") {
          fetchChatInfo ? fetchChatInfo() : null;
        }

        return () => clearInterval(interval);
      }
    }
  }, [userChatInfo?.lastResetDate, setUserChatInfo]);

  if (userChatInfo?.isMember) {
    return null; // Don't render anything for members
  }

  if (pdfUrls !== "PDFTEXT") {
    return null;
  }

  if (userChatInfo?.queriesUsed === undefined) {
    return (
      <div className="p-2 text-center text-sm sm:text-md animate-pulse text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (newButton && userChatInfo.chatOptionsUsed > 2) {
    return <div>2 chats already created! Limit Reached!</div>;
  }

  if (inputArea && userChatInfo.queriesUsed >= 10)
    return (
      <div className="text-red-500 dark:text-red-400 font-semibold text-center mx-4 mb-2">
        Input Disabled
      </div>
    );

  if (!newButton && !inputArea)
    return (
      <div className="fixed left-[50%] right-auto top-10 md:top-20 md:left-auto md:right-4 p-3">
        <div className="relative group">
          {/* Timer Text Displayed in Top Right */}
          <div className="text-sm font-medium cursor-pointer rounded-full px-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {userChatInfo.queriesUsed < 10 && (
              <p className="text-gray-800 dark:text-gray-200 font-medium text-md">
                {10 - parseInt(userChatInfo.queriesUsed)} queries left (pdf)
              </p>
            )}

            {timeLeft && userChatInfo.queriesUsed >= 10 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Reset in: <span className="font-medium">{timeLeft}</span>
              </p>
            )}
          </div>

          {/* Full Alert Shown on Hover */}
          <div className="absolute top-full mt-2 right-0 w-72 p-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-md text-center rounded-lg opacity-0 pointer-events-none hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 transform -translate-y-2">
            {userChatInfo.queriesUsed >= 10 ? (
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium text-md">
                  <span className="text-red-600 dark:text-red-500">
                    Limit Reached
                  </span>{" "}
                  &mdash; Upgrade to{" "}
                  <Link href="/pricing">
                    <span className="underline text-blue-500 dark:text-blue-400">
                      membership
                    </span>
                  </Link>{" "}
                  or wait for reset.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Reset in:{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {timeLeft}
                  </span>{" "}
                  (every 2 hours)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium text-md">
                  {10 - parseInt(userChatInfo.queriesUsed)} queries left
                </p>
                {timeLeft && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Reset in: <span className="font-medium">{timeLeft}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default LimitReachedComponent;
