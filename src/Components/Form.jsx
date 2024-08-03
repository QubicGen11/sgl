import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { motion } from 'framer-motion';
import StarRatings from 'react-star-ratings';

const Form = () => {
  const initialFormData = {
    title: '',
    email: '',
    organizationName: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    services: [],
    individuals: [],
    professionalism: {},
    responseTime: {},
    overallServices: {},
    feedbacks: {}, // Store feedback for each individual
    recommend: '',
    subscribeNewsletter: '',
    termsAccepted: false,
    customResponses: {}
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState({
    titleOptions: [],
    feedbackQuestions: [],
  });

  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/admin/form-defaults', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data || {};
        setDefaultSettings({
          titleOptions: data.titleOptions || [],
          feedbackQuestions: data.feedbackQuestions || [],
        });
        setFormData((prev) => ({
          ...prev,
          title: data.titleOptions && data.titleOptions.length > 0 ? data.titleOptions[0] : '',
          email: data.email || '',
          organizationName: data.organizationName || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
        }));
      } catch (error) {
        console.error('Error fetching default settings:', error);
      }
    };

    fetchDefaults();
  }, []);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/lists');
        const data = response.data || {};
        setFormData((prev) => ({
          ...prev,
          individuals: data.individualsList.map(ind => `${ind.name} (${ind.designation})`) || [], // Including designation in the individual name
          services: data.servicesList || [],
        }));
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      if (checked) {
        return {
          ...prevFormData,
          [field]: [...prevFormData[field], value],
        };
      } else {
        return {
          ...prevFormData,
          [field]: prevFormData[field].filter((item) => item !== value),
        };
      }
    });
  };

  const handleRatingChange = (newRating, name, field) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: {
        ...prevFormData[field],
        [name]: newRating
      }
    }));
  };

  const handleCustomResponseChange = (question, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      customResponses: {
        ...prevFormData.customResponses,
        [question]: value
      }
    }));
  };

  const handleTermsChange = (e) => {
    setFormData({
      ...formData,
      termsAccepted: e.target.checked
    });
  };

  const handleFeedbackChange = (e, individual) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      feedbacks: {
        ...prevFormData.feedbacks,
        [individual]: e.target.value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
  
    console.log('Form Data:', formData); // Log the entire formData object
  
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.organizationName) newErrors.organizationName = 'Organization Name is required';
    if (formData.services.length === 0) newErrors.services = 'At least one service must be selected';
    if (formData.individuals.length === 0) newErrors.individuals = 'At least one individual must be selected';
  
    console.log('Errors after basic checks:', newErrors); // Log errors after basic checks
  
    formData.individuals.forEach(individual => {
      console.log('Checking individual:', individual); // Log the individual being checked
      if (!formData.professionalism[individual]) {
        newErrors[`professionalism-${individual}`] = `Professionalism rating for ${individual} is required`;
      }
      if (!formData.responseTime[individual]) {
        newErrors[`responseTime-${individual}`] = `Response time rating for ${individual} is required`;
      }
      if (!formData.overallServices[individual]) {
        newErrors[`overallServices-${individual}`] = `Overall services rating for ${individual} is required`;
      }
      if (!formData.feedbacks[individual]) {
        newErrors[`feedback-${individual}`] = `Feedback for ${individual} is required`;
      }
    });
  
    if (!formData.recommend) newErrors.recommend = 'Recommendation is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
  
    console.log('Final Errors:', newErrors); // Log final errors
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill out all required fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    setLoading(true);
  
    try {
      // Parallel API calls
      const formSubmitPromise = axios.post('http://localhost:8083/api/feedback', {
        ...formData,
        feedback: Object.entries(formData.feedbacks)
          .map(([individual, feedback]) => `${individual}: ${feedback}`)
          .join(' | '),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const [formSubmitResponse] = await Promise.all([formSubmitPromise]);
  
      if (formSubmitResponse.status === 200 || formSubmitResponse.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Form data saved!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          setFormData(initialFormData);
          setLoading(false);
        });
      } else {
        throw new Error('Failed to save form data');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setLoading(false);
    }
  };
  

  
  

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-8 transition-all duration-300`}>
      <header className="flex justify-between items-center mb-8">
        <img
          src="https://somireddylaw.com/wp-content/uploads/2022/10/slg-logo-_2_.webp"
          alt="Somireddy Law Group"
          className="w-48 transition-transform duration-300 ease-in-out transform hover:scale-110"
        />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
        </button>
      </header>

      <motion.div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-4xl mx-auto p-8 rounded-lg shadow-lg`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-center text-2xl font-bold mb-4">Somireddy Law Group PLLC - Client Feedback</h2>
        <p className="text-center mb-4">We are dedicated to delivering the highest quality of service to our clients. Your feedback is invaluable to enable us to better meet your expectations. We sincerely appreciate your time and cooperation in this matter. To assist us in improving our services, we kindly request your input on the following points:</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title <span className="text-red-500">*</span></label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              required
            >
              {Array.isArray(defaultSettings?.titleOptions) && defaultSettings.titleOptions.length > 0 ? (
                defaultSettings.titleOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))
              ) : (
                <option value="" disabled>No options available</option>
              )}
            </select>
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              required
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Office Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              required
            />
            {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Please select one of the following services provided by Somireddy Law Group that you have received. <span className="text-red-500">*</span></label>
            <div className="mt-2">
              {formData.services.map((service) => (
                <div key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    name="services"
                    value={service}
                    checked={formData.services.includes(service)}
                    onChange={(e) => handleCheckboxChange(e, 'services')}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{service}</label>
                </div>
              ))}
            </div>
            {errors.services && <p className="text-red-500 text-sm">{errors.services}</p>}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select the names of the Employees who worked on your cases <span className="text-red-500">*</span></label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`mt-1 flex items-center justify-between w-full h-14 overflow-y-auto p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'} rounded`}
              >
                <span>{formData.individuals.length > 0 ? formData.individuals.join(', ') : 'Select'}</span>
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 01.832.445l4 6a1 1 0 01-1.664 1.11L10 5.432 6.832 10.555a1 1 0 11-1.664-1.11l4-6A1 1 0 0110 3z" clipRule="evenodd" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className={`absolute mt-1 w-full h-36 overflow-y-auto rounded-md shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <div className="py-1">
                    {formData.individuals.map((individual) => (
                      <div key={individual} className="flex items-center px-4 py-2">
                        <input
                          type="checkbox"
                          value={individual}
                          checked={formData.individuals.includes(individual)}
                          onChange={(e) => handleCheckboxChange(e, 'individuals')}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {individual}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.individuals && <p className="text-red-500 text-sm">{errors.individuals}</p>}
          </div>

          {formData.individuals.length > 0 && formData.individuals.map((individual) => (
            <div key={individual}>
              <h3 className="text-lg font-semibold mb-2">{individual}</h3>

              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>On a scale of 1-5, how would you rate {individual}'s professionalism? <span className="text-red-500">*</span></label>
                <StarRatings
                  rating={formData.professionalism[individual] || 0}
                  starRatedColor="gold"
                  starHoverColor="gold"
                  changeRating={(newRating) => handleRatingChange(newRating, individual, 'professionalism')}
                  numberOfStars={5}
                  name={`professionalism-${individual}`}
                  starDimension="24px"
                  starSpacing="2px"
                />
                {errors[`professionalism-${individual}`] && <p className="text-red-500 text-sm">{errors[`professionalism-${individual}`]}</p>}
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>On a scale of 1-5, how would you rate {individual}'s response time? <span className="text-red-500">*</span></label>
                <StarRatings
                  rating={formData.responseTime[individual] || 0}
                  starRatedColor="gold"
                  starHoverColor="gold"
                  changeRating={(newRating) => handleRatingChange(newRating, individual, 'responseTime')}
                  numberOfStars={5}
                  name={`responseTime-${individual}`}
                  starDimension="24px"
                  starSpacing="2px"
                />
                {errors[`responseTime-${individual}`] && <p className="text-red-500 text-sm">{errors[`responseTime-${individual}`]}</p>}
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>On a scale of 1-5, how would you rate the overall services of {individual}? <span className="text-red-500">*</span></label>
                <StarRatings
                  rating={formData.overallServices[individual] || 0}
                  starRatedColor="gold"
                  starHoverColor="gold"
                  changeRating={(newRating) => handleRatingChange(newRating, individual, 'overallServices')}
                  numberOfStars={5}
                  name={`overallServices-${individual}`}
                  starDimension="24px"
                  starSpacing="2px"
                />
                {errors[`overallServices-${individual}`] && <p className="text-red-500 text-sm">{errors[`overallServices-${individual}`]}</p>}
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Please provide any feedback that would be helpful for us to improve our services <span className="text-red-500">*</span></label>
                <textarea
                  name={`feedback-${individual}`}
                  value={formData.feedbacks[individual] || ''}
                  onChange={(e) => handleFeedbackChange(e, individual)}
                  className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
                  required
                />
                {errors[`feedback-${individual}`] && <p className="text-red-500 text-sm">{errors[`feedback-${individual}`]}</p>}
              </div>
            </div>
          ))}

          {/* Render custom feedback questions */}
          {defaultSettings?.feedbackQuestions?.map((question, index) => (
            <div key={index} className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {question} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customResponses[question] || ''}
                onChange={(e) => handleCustomResponseChange(question, e.target.value)}
                className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
                required
              />
              {errors[`customResponse-${question}`] && <p className="text-red-500 text-sm">{errors[`customResponse-${question}`]}</p>}
            </div>
          ))}

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Would you recommend our services to your friends and family? <span className="text-red-500">*</span></label>
            <div className="flex justify-between mt-2">
              {['Yes', 'No', 'Maybe'].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="recommend"
                    value={option}
                    checked={formData.recommend === option}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                    required
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{option}</label>
                </div>
              ))}
            </div>
            {errors.recommend && <p className="text-red-500 text-sm">{errors.recommend}</p>}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Would you like to subscribe to our newsletter? <span className="text-red-500">*</span></label>
            <div className="flex justify-between mt-2">
              {['Yes', 'No'].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="subscribeNewsletter"
                    value={option}
                    checked={formData.subscribeNewsletter === option}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                    required
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{option}</label>
                </div>
              ))}
            </div>
            {errors.subscribeNewsletter && <p className="text-red-500 text-sm">{errors.subscribeNewsletter}</p>}
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleTermsChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                required
              />
              <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                I accept the terms and conditions
              </label>
            </div>
            {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Form;
