import { FaRobot, FaQuestionCircle, FaBell, FaBook } from 'react-icons/fa';

const Features = () => {
  return (
    <div className="my-8 p-4 md:p-5">
      <div className="flex flex-col md:flex-row justify-around gap-10">
        <div className="text-center">
          <FaRobot className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-primary dark:text-secondary">AI Chatbot</h3>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Get personalized assistance by interacting with an intelligent chatbot that analyzes PDF content.</p>
        </div>
        <div className="text-center">
          <FaQuestionCircle className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-primary dark:text-secondary">Q&A Forum</h3>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Engage in structured discussions, ask questions, and find answers in an organized manner.</p>
        </div>
        <div className="text-center">
          <FaBell className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-primary dark:text-secondary">Notifications</h3>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Stay updated with notifications via Gmail and WhatsApp for new notes and important updates.</p>
        </div>
        <div className="text-center">
          <FaBook className="text-accent-600 dark:text-accent-800 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-primary dark:text-secondary">Resource Repository</h3>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Access a comprehensive repository of educational resources including notes, past papers, and books.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
