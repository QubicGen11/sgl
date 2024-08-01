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
  const [defaultSettings, setDefaultSettings] = useState(null);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]); // New state for titleOptions
  const [newsletterOptions, setNewsletterOptions] = useState([]); // New state for newsletterOptions
  const [formData, setFormData] = useState({ customResponses: {} }); // Initialize formData with customResponses
  const [errors, setErrors] = useState({}); // Initialize errors

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/lists');
        const data = response.data || {}; // Fallback to an empty object if response.data is null
        setIndividualsList(data.individualsList || []); // Default to an empty array if null
        setServicesList(data.servicesList || []); // Default to an empty array if null
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };
  
    fetchLists();
  }, []);
  
  useEffect(() => {
    const fetchDefaultSettings = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
          throw new Error('No token found');
        }
  
        const response = await axios.get('http://localhost:8083/api/admin/form-defaults', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        });
        const data = response.data || {}; // Fallback to an empty object if response.data is null
        setDefaultSettings({
          email: data.email || '',
          organizationName: data.organizationName || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
          feedbackQuestions: data.feedbackQuestions || [], // Default to an empty array if null
          titleOptions: data.titleOptions || [], // Default to an empty array if null
          newsletterOptions: data.newsletterOptions || [], // Default to an empty array if null
        });
        setCustomQuestions(data.feedbackQuestions || []); // Default to an empty array if null
        setTitleOptions(data.titleOptions || []); // Set title options
        setNewsletterOptions(data.newsletterOptions || []); // Set newsletter options
        setFormData({
          customResponses: (data.feedbackQuestions || []).reduce((acc, question) => {
            acc[question] = '';
            return acc;
          }, {}),
        });
      } catch (error) {
        console.error('Error fetching default settings:', error);
        if (error.response && error.response.status === 403) {
          Swal.fire({
            title: 'Access Denied',
            text: 'You do not have permission to access this resource.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
  
    fetchDefaultSettings();
  }, []);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleUpdateIndividualsList = async (updatedList) => {
    setIndividualsList(updatedList);
  };

  const handleUpdateServicesList = async (updatedList) => {
    setServicesList(updatedList);
  };

  const handleSubmitAllUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.all([
        axios.post('http://localhost:8083/api/lists/individuals', { updatedList: individualsList }),
        axios.post('http://localhost:8083/api/lists/services', { updatedList: servicesList }),
        axios.post('http://localhost:8083/api/admin/form-defaults', { 
          ...defaultSettings, 
          feedbackQuestions: customQuestions, 
          titleOptions, 
          newsletterOptions 
        }, {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the request header
          }
        })
      ]);
      Swal.fire({
        title: 'Success',
        text: 'All updates saved successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save updates',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleAddQuestion = () => {
    setCustomQuestions([...customQuestions, '']);
  };

  const handleUpdateQuestion = (index, value) => {
    const updatedQuestions = [...customQuestions];
    updatedQuestions[index] = value;
    setCustomQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = customQuestions.filter((_, i) => i !== index);
    setCustomQuestions(updatedQuestions);
  };

  const handleCustomResponseChange = (question, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      customResponses: {
        ...prevFormData.customResponses,
        [question]: value,
      },
    }));
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
        'http://localhost:8083/api/admin/change-password',
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
              onClick={() => setViewMode('edit-form')}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${viewMode === 'edit-form' ? 'bg-blue-700' : ''}`}
            >
              Edit Form
            </button>
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
          {viewMode === 'edit-form' && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded shadow-md h-[60vh] w-[60vw] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-black">Edit Form</h2>
               
                <div className="mb-8">
              
                  <div className="mb-4 w-64">
                    <label className="block text-sm font-medium w-14 text-gray-700">Title</label>
                    {titleOptions.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          
                          value={option}
                          onChange={(e) => {
                            const updatedList = [...titleOptions];
                            updatedList[index] = e.target.value;
                            setTitleOptions(updatedList);
                          }}
                          className="flex-1 text-black mr-2 p-2 border border-gray-300 w-14 rounded"
                        />
                        <button
                          onClick={() => {
                            const updatedList = titleOptions.filter((_, i) => i !== index);
                            setTitleOptions(updatedList);
                          }}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setTitleOptions([...titleOptions, '']);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Add Title Option
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="text"
                      value={defaultSettings?.email || ''}
                      onChange={(e) => setDefaultSettings({ ...defaultSettings, email: e.target.value })}
                      className="flex-1 mr-2 p-2 text-black border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Office Name</label>
                    <input
                      type="text"
                      value={defaultSettings?.organizationName || ''}
                      onChange={(e) => setDefaultSettings({ ...defaultSettings, organizationName: e.target.value })}
                      className="flex-1 mr-2 p-2 text-black border border-gray-300 rounded"
                    />
                  </div>
                 
                  {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Newsletter Options</label>
                    {newsletterOptions.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const updatedList = [...newsletterOptions];
                            updatedList[index] = e.target.value;
                            setNewsletterOptions(updatedList);
                          }}
                          className="flex-1 text-black mr-2 p-2 border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => {
                            const updatedList = newsletterOptions.filter((_, i) => i !== index);
                            setNewsletterOptions(updatedList);
                          }}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setNewsletterOptions([...newsletterOptions, '']);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Add Newsletter Option
                    </button>
                  </div> */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={defaultSettings?.firstName || ''}
                      onChange={(e) => setDefaultSettings({ ...defaultSettings, firstName: e.target.value })}
                      className="flex-1 mr-2 p-2 text-black border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={defaultSettings?.lastName || ''}
                      onChange={(e) => setDefaultSettings({ ...defaultSettings, lastName: e.target.value })}
                      className="flex-1 mr-2 p-2 text-black border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      value={defaultSettings?.phoneNumber || ''}
                      onChange={(e) => setDefaultSettings({ ...defaultSettings, phoneNumber: e.target.value })}
                      className="flex-1 mr-2 p-2 text-black border border-gray-300 rounded"
                    />
                  </div>
               
                </div> <div className="mb-8 w-64">
                  <h3 className="text-lg font-semibold text-black">Add Employee Name</h3>
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
                </div>
                <div className="mb-8 w-64">
                  <h3 className="text-lg font-semibold text-black">Add Services Name</h3>
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
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-black">Edit Test Questions</h3>
                  {defaultSettings?.feedbackQuestions?.map((question, index) => (
                    <div key={index} className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {question} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.customResponses?.[question] || ''}
                        onChange={(e) => handleCustomResponseChange(question, e.target.value)}
                        className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
                        required
                      />
                      {errors[`customResponse-${question}`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`customResponse-${question}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-black">Edit Custom Questions</h3>
                  {customQuestions.map((question, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => handleUpdateQuestion(index, e.target.value)}
                        className="flex-1 mr-2 p-2 text-black border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddQuestion}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Add Question
                  </button>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSubmitAllUpdates}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save All
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
