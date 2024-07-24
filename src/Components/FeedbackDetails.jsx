import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoon, FaSun } from 'react-icons/fa';

const FeedbackDetails = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [shortView, setShortView] = useState(true);
  const [showEmailFilter, setShowEmailFilter] = useState(true);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);

  useEffect(() => {
    if (showAllFeedbacks) {
      const fetchFeedbacks = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/feedback');
          setFeedbacks(response.data);
        } catch (error) {
          console.error('Error fetching feedbacks:', error);
        }
      };
      fetchFeedbacks();
    }
  }, [showAllFeedbacks]);

  useEffect(() => {
    if (searchEmail) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/feedback/suggestions?email=${searchEmail}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching email suggestions:', error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchEmail]);

  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSelectedFeedback(null);
    setShortView(true);
    setShowAllFeedbacks(false);
    try {
      const response = await axios.get(`http://localhost:3000/api/feedback?email=${searchEmail}`);
      setSelectedFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback details:', error);
    }
  };

  const handleSuggestionClick = async (email) => {
    setSearchEmail(email);
    setSuggestions([]);
    setSelectedFeedback(null);
    setShortView(true);
    setShowAllFeedbacks(false);
    try {
      const response = await axios.get(`http://localhost:3000/api/feedback?email=${email}`);
      setSelectedFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback details:', error);
    }
  };

  const handleDateFilterSubmit = async (e) => {
    e.preventDefault();
    setSelectedFeedback(null);
    setShowAllFeedbacks(false);
    try {
      const response = await axios.get(`http://localhost:3000/api/feedback/date-range?startDate=${filterDate}&endDate=${filterDate}`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks within date range:', error);
    }
  };

  const handleViewMore = () => {
    setShortView(false);
  };

  const toggleFilter = (filterType) => {
    if (filterType === 'email') {
      setShowEmailFilter(!showEmailFilter);
      setShowDateFilter(false);
    } else if (filterType === 'date') {
      setShowDateFilter(!showDateFilter);
      setShowEmailFilter(false);
    }
  };

  const handleViewAllFeedbacks = () => {
    setShowAllFeedbacks(true);
    setSelectedFeedback(null);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-8`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between mb-4">
          <button onClick={() => toggleFilter('email')} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">Search by Email</button>
          <button onClick={() => toggleFilter('date')} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">Filter by Date</button>
          <button onClick={handleViewAllFeedbacks} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">View All Feedbacks</button>
        </div>

        {showEmailFilter && (
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search by Email</label>
            <div className="relative">
              <input
                type="text"
                value={searchEmail}
                onChange={handleSearchChange}
                placeholder="Enter email"
                className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              />
              <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">Search</button>
              {suggestions.length > 0 && (
                <ul className={`absolute left-0 right-0 mt-2 bg-white shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-black'}`}>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        )}

        {showDateFilter && (
          <form onSubmit={handleDateFilterSubmit} className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filter by Date</label>
            <div className="flex">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className={`mt-1 block w-1/2 p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              />
              <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">Filter</button>
            </div>
          </form>
        )}

        {showAllFeedbacks && feedbacks.map((feedback, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md mb-4`}>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                value={feedback.email}
                readOnly
                className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              />
            </div>
            <button onClick={() => setSelectedFeedback(feedback)} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">View More</button>
          </div>
        ))}

        {selectedFeedback && shortView && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md`}>
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
            <button onClick={handleViewMore} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">View More</button>
          </div>
        )}

        {selectedFeedback && !shortView && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md`}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDetails;
