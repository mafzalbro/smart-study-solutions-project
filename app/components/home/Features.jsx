import {
  AiOutlineRobot,
  AiOutlineQuestionCircle,
  AiOutlineBell,
  AiOutlineBook,
} from "react-icons/ai";

const featuresData = [
  {
    icon: (
      <AiOutlineRobot className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
    ),
    title: "AI Chatbot",
    description:
      "Get personalized assistance by interacting with an intelligent chatbot that analyzes PDF content.",
  },
  {
    icon: (
      <AiOutlineQuestionCircle className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
    ),
    title: "Q&A Forum",
    description:
      "Engage in structured discussions, ask questions, and find answers in an organized manner.",
  },
  {
    icon: (
      <AiOutlineBell className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
    ),
    title: "Notifications",
    description:
      "Stay updated with notifications via Gmail and WhatsApp for new notes and important updates.",
  },
  {
    icon: (
      <AiOutlineBook className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
    ),
    title: "Resource Repository",
    description:
      "Access a comprehensive repository of educational resources including notes, past papers, and books.",
  },
];

const Features = () => {
  return (
    <div className="my-8 p-4 md:p-5">
      <div className="flex flex-wrap justify-center items-center">
        {featuresData.map((feature, index) => (
          <div key={index} className="text-center mb-8 w-1/2 sm:1/3 md:w-1/4">
            {feature.icon}
            <h3 className="text-2xl font-semibold text-primary dark:text-secondary">
              {feature.title}
            </h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
