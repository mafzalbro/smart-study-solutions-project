import { FaRobot, FaQuestionCircle, FaBell, FaBook } from 'react-icons/fa';

const Features = () => {
  return (
    <div className="my-16">
      <div className="flex flex-col md:flex-row justify-around gap-10">
        <div className="text-center">
          <FaRobot className="text-orange-600 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">AI Chatbot</h3>
          <p className="mt-2">Get personalized assistance by interacting with an intelligent chatbot that analyzes PDF content.</p>
        </div>
        <div className="text-center">
          <FaQuestionCircle className="text-orange-600 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">Q&A Forum</h3>
          <p className="mt-2">Engage in structured discussions, ask questions, and find answers in an organized manner.</p>
        </div>
        <div className="text-center">
          <FaBell className="text-orange-600 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">Notifications</h3>
          <p className="mt-2">Stay updated with notifications via Gmail and WhatsApp for new notes and important updates.</p>
        </div>
        <div className="text-center">
          <FaBook className="text-orange-600 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">Resource Repository</h3>
          <p className="mt-2">Access a comprehensive repository of educational resources including notes, past papers, and books.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
