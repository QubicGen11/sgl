import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoon, FaSun } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

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
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/feedback');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, []);

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
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch feedback details',
        icon: 'error',
        confirmButtonText: 'OK',
      });
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
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch feedback details',
        icon: 'error',
        confirmButtonText: 'OK',
      });
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
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch feedbacks',
        icon: 'error',
        confirmButtonText: 'OK',
      });
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

  const formatRatings = (ratings) => {
    return Object.entries(ratings).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join(', ');
  };

  const exportAllToPDF = () => {
    const doc = new jsPDF();
    doc.text('Feedback Details', 20, 10);
    const tableData = feedbacks.map(feedback => ([
      feedback.email,
      feedback.firstName,
      feedback.lastName,
      feedback.phoneNumber,
      feedback.services ? feedback.services.join(', ') : '',
      feedback.individuals ? feedback.individuals.join(', ') : '',
      formatRatings(feedback.professionalism),
      formatRatings(feedback.responseTime),
      formatRatings(feedback.overallServices),
      feedback.feedback,
      feedback.recommend,
    ]));
    doc.autoTable({
      startY: 20,
      head: [['Email', 'First Name', 'Last Name', 'Phone Number', 'Services', 'Individuals', 'Professionalism Ratings', 'Response Time Ratings', 'Overall Services Ratings', 'Feedback', 'Recommend']],
      body: tableData,
    });
    doc.save('all-feedback-details.pdf');
  };

  const exportAllToExcel = () => {
    const feedbackData = feedbacks.map(feedback => ({
      Email: feedback.email,
      FirstName: feedback.firstName,
      LastName: feedback.lastName,
      PhoneNumber: feedback.phoneNumber,
      Services: feedback.services ? feedback.services.join(', ') : '',
      Individuals: feedback.individuals ? feedback.individuals.join(', ') : '',
      ProfessionalismRatings: formatRatings(feedback.professionalism),
      ResponseTimeRatings: formatRatings(feedback.responseTime),
      OverallServicesRatings: formatRatings(feedback.overallServices),
      Feedback: feedback.feedback,
      Recommend: feedback.recommend,
    }));
    const worksheet = XLSX.utils.json_to_sheet(feedbackData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FeedbackDetails');
    XLSX.writeFile(workbook, 'all-feedback-details.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Feedback Details', 20, 10);
    doc.autoTable({
      startY: 20,
      head: [['Field', 'Value']],
      body: [
        ['Email', selectedFeedback.email],
        ['First Name', selectedFeedback.firstName],
        ['Last Name', selectedFeedback.lastName],
        ['Phone Number', selectedFeedback.phoneNumber],
        ['Services', selectedFeedback.services ? selectedFeedback.services.join(', ') : ''],
        ['Individuals', selectedFeedback.individuals ? selectedFeedback.individuals.join(', ') : ''],
        ['Professionalism Ratings', formatRatings(selectedFeedback.professionalism)],
        ['Response Time Ratings', formatRatings(selectedFeedback.responseTime)],
        ['Overall Services Ratings', formatRatings(selectedFeedback.overallServices)],
        ['Feedback', selectedFeedback.feedback],
        ['Recommend', selectedFeedback.recommend],
      ],
    });
    doc.save('feedback-details.pdf');
  };

  const exportToExcel = () => {
    const feedbackData = {
      Email: selectedFeedback.email,
      FirstName: selectedFeedback.firstName,
      LastName: selectedFeedback.lastName,
      PhoneNumber: selectedFeedback.phoneNumber,
      Services: selectedFeedback.services ? selectedFeedback.services.join(', ') : '',
      Individuals: selectedFeedback.individuals ? selectedFeedback.individuals.join(', ') : '',
      ProfessionalismRatings: formatRatings(selectedFeedback.professionalism),
      ResponseTimeRatings: formatRatings(selectedFeedback.responseTime),
      OverallServicesRatings: formatRatings(selectedFeedback.overallServices),
      Feedback: selectedFeedback.feedback,
      Recommend: selectedFeedback.recommend,
    };
    const worksheet = XLSX.utils.json_to_sheet([feedbackData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FeedbackDetails');
    XLSX.writeFile(workbook, 'feedback-details.xlsx');
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-[rgba(255,255,255,0)] text-gray-900'} min-h-screen p-8 transition-all duration-300`}>
     

      <motion.div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-4xl mx-auto p-8 rounded-lg shadow-lg`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-center text-2xl font-bold mb-4">Feedback Details</h2>
        <div className="flex justify-between mb-4">
          <button onClick={() => toggleFilter('email')} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">Search by Email</button>
          <button onClick={() => toggleFilter('date')} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">Filter by Date</button>
          <button onClick={handleViewAllFeedbacks} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">View All Feedbacks</button>
        </div>

        {showEmailFilter && (
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Search by Email</label>
            <div className="relative">
              <div className='flex w-6/12 '>

              <input
                type="text"
                value={searchEmail}
                onChange={handleSearchChange}
                placeholder="Enter email"
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-lg text-black"
              />
              <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">Search</button>
              </div>
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 bg-white shadow-lg border border-gray-300">
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
            <label className="block text-sm font-medium text-gray-700">Filter by Date</label>
            <div className="flex">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-1 block w-1/2 p-2 border border-gray-300 bg-white text-black"
              />
              <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">Filter</button>
            </div>
          </form>
        )}

        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          <table className="min-w-full bg-white shadow-md rounded my-6">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 text-gray-600 font-bold uppercase text-sm text-left">Email</th>
                <th className="py-3 px-6 bg-gray-200 text-gray-600 font-bold uppercase text-sm text-left">First Name</th>
                <th className="py-3 px-6 bg-gray-200 text-gray-600 font-bold uppercase text-sm text-left">Last Name</th>
                <th className="py-3 px-6 bg-gray-200 text-gray-600 font-bold uppercase text-sm text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showAllFeedbacks ? (
                feedbacks.map((feedback, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6">{feedback.email}</td>
                    <td className="py-3 px-6">{feedback.firstName}</td>
                    <td className="py-3 px-6">{feedback.lastName}</td>
                    <td className="py-3 px-6">
                      <button onClick={() => setSelectedFeedback(feedback)} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">View More</button>
                    </td>
                  </tr>
                ))
              ) : (
                feedbacks.slice(0, 3).map((feedback, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6">{feedback.email}</td>
                    <td className="py-3 px-6">{feedback.firstName}</td>
                    <td className="py-3 px-6">{feedback.lastName}</td>
                    <td className="py-3 px-6">
                      <button onClick={() => setSelectedFeedback(feedback)} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">View More</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-4">
          <button onClick={exportAllToPDF} className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 mr-2">Export All to PDF</button>
          <button onClick={exportAllToExcel} className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">Export All to Excel</button>
        </div>

        {selectedFeedback && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <motion.div
              className="bg-white p-4 rounded shadow-md w-1/2 relative"
              style={{ maxHeight: '80vh', overflowY: 'scroll' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className=''>
                <h3 className="text-lg font-semibold mb-2">Feedback Details</h3>
                <button onClick={() => setSelectedFeedback(null)} className="absolute top-2 right-2 text-gray-500 text-3xl">&times;</button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedFeedback.email}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={selectedFeedback.firstName}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={selectedFeedback.lastName}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={selectedFeedback.phoneNumber}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <input
                  type="text"
                  value={selectedFeedback.services ? selectedFeedback.services.join(', ') : ''}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Individuals</label>
                <input
                  type="text"
                  value={selectedFeedback.individuals ? selectedFeedback.individuals.join(', ') : ''}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              {selectedFeedback.individuals && selectedFeedback.individuals.map((individual, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">{individual}</h4>
                  <label className="block text-sm font-medium text-gray-700">Professionalism Rating</label>
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
                        <label className="ml-2 text-sm text-gray-700">{rating}</label>
                      </div>
                    ))}
                  </div>
                  <label className="block text-sm font-medium text-gray-700">Response Time Rating</label>
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
                        <label className="ml-2 text-sm text-gray-700">{rating}</label>
                      </div>
                    ))}
                  </div>
                  <label className="block text-sm font-medium text-gray-700">Overall Services Rating</label>
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
                        <label className="ml-2 text-sm text-gray-700">{rating}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                  value={selectedFeedback.feedback}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Recommend</label>
                <input
                  type="text"
                  value={selectedFeedback.recommend}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 mr-2">Export to PDF</button>
                <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">Export to Excel</button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FeedbackDetails;
