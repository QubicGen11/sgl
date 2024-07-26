import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import FeedbackDetails from './FeedbackDetails';
import axios from 'axios';

const Admin = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState('view');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [individualsList, setIndividualsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/lists');
        setIndividualsList(response.data.individualsList);
        setServicesList(response.data.servicesList);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, []);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleUpdateIndividualsList = async (updatedList) => {
    try {
      await axios.post('http://localhost:3000/api/lists/individuals', { updatedList });
      setIndividualsList(updatedList);
      setViewMode('view');
    } catch (error) {
      console.error('Error updating individuals list:', error);
    }
  };

  const handleUpdateServicesList = async (updatedList) => {
    try {
      await axios.post('http://localhost:3000/api/lists/services', { updatedList });
      setServicesList(updatedList);
      setViewMode('view');
    } catch (error) {
      console.error('Error updating services list:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/admin/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      Swal.fire({
        title: 'Success',
        text: 'Password changed successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to change password',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full"
      >
        <source src="https://res.cloudinary.com/defsu5bfc/video/upload/v1721895303/lawyer-2_p11u9h.mp4" type="video/mp4" />
      </video>

      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} relative z-10 flex flex-col items-center justify-center p-8 bg-black bg-opacity-50 min-h-screen`}>
        <header className="flex justify-between items-center mb-8 w-full max-w-4xl">
          <a href="/">
            <img
              src="https://somireddylaw.com/wp-content/uploads/2022/10/slg-logo-_2_.webp"
              alt="Somireddy Law Group"
              className="w-48 transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </a>
        </header>

        <h1 className="text-2xl font-bold mb-8 text-white">Admin Dashboard</h1>
        <div className="flex space-x-4 mb-8 relative">
          <button
            onClick={() => setViewMode('view')}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${viewMode === 'view' ? 'bg-blue-700' : ''}`}
          >
            View Feedback 
          </button>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${viewMode.includes('edit') ? 'bg-blue-700' : ''}`}
            >
              Edit Form
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 w-full mt-1 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={() => setViewMode('edit-individuals')}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Edit Individuals
                </button>
                <button
                  onClick={() => setViewMode('edit-services')}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Edit Services
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowChangePassword(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        <div className="w-full max-w-4xl">
          {viewMode === 'view' && <FeedbackDetails />}
          {viewMode === 'edit-individuals' && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded shadow-md h-96 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-black">Edit Individuals List</h2>
                {individualsList.map((individual, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={individual}
                      onChange={(e) => {
                        const updatedList = [...individualsList];
                        updatedList[index] = e.target.value;
                        setIndividualsList(updatedList);
                      }}
                      className="flex-1 mr-2 p-2 text-black border border-gray-300 rounded"
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
                    onClick={() => setViewMode('view')}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {viewMode === 'edit-services' && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4 text-black">Edit Services List</h2>
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
                      className="flex-1 text-black mr-2 p-2 border border-gray-300 rounded"
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
                    onClick={() => setViewMode('view')}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showChangePassword && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-md w-1/3">
              <h2 className="text-xl font-bold mb-4 text-black">Change Password</h2>
              <form onSubmit={handleChangePasswordSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <div className="relative">
                    <input
                      type={currentPasswordVisible ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 block w-full p-2 border text-black border-gray-300 rounded"
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleCurrentPasswordVisibility}
                    >
                      {currentPasswordVisible ? <FaEyeSlash className='text-black' /> : <FaEye className='text-black' />}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={newPasswordVisible ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full p-2 border text-black border-gray-300 rounded"
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleNewPasswordVisibility}
                    >
                      {newPasswordVisible ? <FaEyeSlash className='text-black' /> : <FaEye className='text-black' />}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
