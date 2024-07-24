import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoon, FaSun } from 'react-icons/fa';

const Admin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [individualsList, setIndividualsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [showEditIndividuals, setShowEditIndividuals] = useState(false);
  const [showEditServices, setShowEditServices] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/feedback');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/lists');
        setIndividualsList(response.data.individualsList);
        setServicesList(response.data.servicesList);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchFeedbacks();
    fetchLists();
  }, []);

  const handleUpdateIndividualsList = async (updatedList) => {
    try {
      await axios.post('http://localhost:3000/api/lists/individuals', { updatedList });
      setIndividualsList(updatedList);
      setShowEditIndividuals(false);
    } catch (error) {
      console.error('Error updating individuals list:', error);
    }
  };

  const handleUpdateServicesList = async (updatedList) => {
    try {
      await axios.post('http://localhost:3000/api/lists/services', { updatedList });
      setServicesList(updatedList);
      setShowEditServices(false);
    } catch (error) {
      console.error('Error updating services list:', error);
    }
  };

  const handleShowFeedback = (feedback) => {
    setSelectedFeedback(feedback);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-8`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button
            onClick={() => setShowEditIndividuals(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit Individuals
          </button>
          <button
            onClick={() => setShowEditServices(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit Services
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className={`min-w-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
          <thead>
            <tr>
              <th className="py-2">Email</th>
              <th className="py-2">Full Name</th>
              <th className="py-2">Phone Number</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback._id} className={`${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <td className="py-2">{feedback.email}</td>
                <td className="py-2">{feedback.fullName}</td>
                <td className="py-2">{feedback.phoneNumber}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleShowFeedback(feedback)}
                  >
                    Show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFeedback && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md mt-4`}>
          <h3 className="text-lg font-semibold mb-2">Feedback Details</h3>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              value={selectedFeedback.email}
              readOnly
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
            <input
              type="text"
              value={selectedFeedback.firstName}
              readOnly
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
            <input
              type="text"
              value={selectedFeedback.lastName}
              readOnly
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
            <input
              type="text"
              value={selectedFeedback.phoneNumber}
              readOnly
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Services</label>
            <input
              type="text"
              value={selectedFeedback.services.join(', ')}
              readOnly
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Individuals</label>
            <input
              type="text"
              value={selectedFeedback.individuals.join(', ')}
              readOnly
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
            />
          </div>
          {selectedFeedback.individuals.map((individual) => (
            <div key={individual} className="mb-4">
              <h4 className="text-lg font-semibold mb-2">{individual}</h4>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Professionalism Rating</label>
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      value={rating}
                      checked={selectedFeedback.professionalism[individual] === String(rating)}
                      readOnly
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rating}</label>
                  </div>
                ))}
              </div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Response Time Rating</label>
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      value={rating}
                      checked={selectedFeedback.responseTime[individual] === String(rating)}
                      readOnly
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rating}</label>
                  </div>
                ))}
              </div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Overall Services Rating</label>
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      value={rating}
                      checked={selectedFeedback.overallServices[individual] === String(rating)}
                      readOnly
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rating}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Feedback</label>
            <textarea
              value={selectedFeedback.feedback}
              readOnly
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recommend</label>
            <div className="flex justify-between mt-2">
              {['Yes', 'No', 'Maybe'].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    value={option}
                    checked={selectedFeedback.recommend === option}
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditIndividuals && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center ">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md h-96 overflow-y-auto`}>
            <h2 className="text-xl font-bold mb-4">Edit Individuals List</h2>
            {individualsList.map((individual, index) => (
              <div key={index} className="flex items-center mb-2 ">
                <input
                  type="text"
                  value={individual}
                  onChange={(e) => {
                    const updatedList = [...individualsList];
                    updatedList[index] = e.target.value;
                    setIndividualsList(updatedList);
                  }}
                  className="flex-1 mr-2 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => {
                    const updatedList = individualsList.filter((_, i) => i !== index);
                    setIndividualsList(updatedList);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setIndividualsList([...individualsList, '']);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Individual
            </button>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleUpdateIndividualsList(individualsList)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditIndividuals(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditServices && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md`}>
            <h2 className="text-xl font-bold mb-4">Edit Services List</h2>
            {servicesList.map((service, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => {
                    const updatedList = [...servicesList];
                    updatedList[index] = e.target.value;
                    setServicesList(updatedList);
                  }}
                  className="flex-1 mr-2 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => {
                    const updatedList = servicesList.filter((_, i) => i !== index);
                    setServicesList(updatedList);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setServicesList([...servicesList, '']);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Service
            </button>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleUpdateServicesList(servicesList)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditServices(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
