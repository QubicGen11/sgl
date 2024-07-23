import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import getConfig from './config';


const FeedbackDetails = () => {
  const { apiUrl } = getConfig();

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Fetch all emails from the feedbacks
    const fetchEmails = async () => {
      const response = await fetch(`${apiUrl}/feedback`);
      const data = await response.json();
      const uniqueEmails = [...new Set(data.map(feedback => feedback.email))];
      setEmails(uniqueEmails);
    };

    fetchEmails();
  }, [apiUrl]);

  const handleEmailChange = async (e) => {
    setSelectedEmail(e.target.value);

    // Fetch feedback details for the selected email
    const response = await fetch(`${apiUrl}/feedback?email=${e.target.value}`);
    const data = await response.json();
    setFeedback(data);
  };
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-8`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Retrieve Feedback</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
          {darkMode ? '' : ''}
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Email</label>
          <select
            value={selectedEmail}
            onChange={handleEmailChange}
            className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
          >
            <option value="">-- Select an email --</option>
            {emails.map((email) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>

        {feedback && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md`}>
            <h3 className="text-lg font-semibold mb-2">Feedback Details</h3>
            <p><strong>Full Name:</strong> {feedback.fullName}</p>
            <p><strong>Email:</strong> {feedback.email}</p>
            <p><strong>Phone Number:</strong> {feedback.phoneNumber}</p>
            <p><strong>Services:</strong> {feedback.services.join(', ')}</p>
            <p><strong>Individuals:</strong> {feedback.individuals.join(', ')}</p>
            <p><strong>Professionalism Ratings:</strong> {JSON.stringify(feedback.professionalism)}</p>
            <p><strong>Response Time Ratings:</strong> {JSON.stringify(feedback.responseTime)}</p>
            <p><strong>Overall Services Ratings:</strong> {JSON.stringify(feedback.overallServices)}</p>
            <p><strong>Feedback:</strong> {feedback.feedback}</p>
            <p><strong>Recommend:</strong> {feedback.recommend}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDetails;