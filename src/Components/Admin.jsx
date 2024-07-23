import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Admin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [updatedFeedback, setUpdatedFeedback] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await fetch('http://localhost:3000/api/feedback');
      // const response = await fetch('https://sgl-backend-one.vercel.app/api/feedback');
      const data = await response.json();
      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, []);

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setUpdatedFeedback(feedback);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/feedback/${id}`, {
      // const response = await fetch(`https://sgl-backend-one.vercel.app/api/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFeedback),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Feedback updated!',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        const updatedFeedbacks = feedbacks.map((feedback) =>
          feedback._id === id ? updatedFeedback : feedback
        );
        setFeedbacks(updatedFeedbacks);
        setEditingFeedback(null);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update feedback',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
       const response = await fetch(`http://localhost:3000/api/feedback/${id}`, {
      // const response = await fetch(`https://sgl-backend-one.vercel.app/api/feedback/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Feedback deleted!',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        const updatedFeedbacks = feedbacks.filter((feedback) => feedback._id !== id);
        setFeedbacks(updatedFeedbacks);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete feedback',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFeedback({
      ...updatedFeedback,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setUpdatedFeedback((prevData) => {
      if (checked) {
        return {
          ...prevData,
          [field]: [...prevData[field], value],
        };
      } else {
        return {
          ...prevData,
          [field]: prevData[field].filter((item) => item !== value),
        };
      }
    });
  };

  const handleRatingChange = (e, individual, field) => {
    const { value } = e.target;
    setUpdatedFeedback((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [individual]: value
      }
    }));
  };

  const individualsList = [
    'Aishwarya', 'Akashkumar', 'Akhila', 'Anjali', 'Anudeep', 'Ashwini', 'Baji', 'Bharghav', 'Booja', 'Divya',
    'Harshit', 'Hemaletha', 'Hemendra', 'Hrithik', 'Ishika', 'Jahnavi', 'Jigsaya', 'Kalyani', 'Kiran', 'Kunmun',
    'Lakshmana Rao', 'Manga', 'Mani', 'Manish', 'Manohar', 'Monica', 'Nikhita', 'Pradeep', 'Pranathi', 'Praveen',
    'Rama Rao', 'Ravi Kumar', 'Raviteja', 'Shashank', 'Sheeja', 'Shreyas', 'Smitha', 'Sneha', 'Sravan', 'Srikanth',
    'Subham', 'Sumavanthi', 'Surabhi', 'Venkatesh'
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-8`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
          {darkMode ? '' : ''}
        </button>
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
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(feedback)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(feedback._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingFeedback && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-md mt-4`}>
          <h3 className="text-lg font-semibold mb-2">Edit Feedback</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editingFeedback._id); }}>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                name="email"
                value={updatedFeedback.email}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={updatedFeedback.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={updatedFeedback.phoneNumber}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              />
            </div>

            <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Individuals</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`mt-1 flex items-center justify-between w-full h-14 overflow-y-auto p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-black'} rounded`}
                >
                  <span>{updatedFeedback.individuals?.length > 0 ? updatedFeedback.individuals.join(', ') : 'Select'}</span>
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.832.445l4 6a1 1 0 01-1.664 1.11L10 5.432 6.832 10.555a1 1 0 11-1.664-1.11l4-6A1 1 0 0110 3z" clipRule="evenodd" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className={`absolute mt-1 w-full h-36 overflow-y-auto rounded-md shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <div className="py-1">
                      {individualsList.map((individual) => (
                        <div key={individual} className="flex items-center px-4 py-2">
                          <input
                            type="checkbox"
                            value={individual}
                            checked={updatedFeedback.individuals?.includes(individual)}
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
            </div>

            {updatedFeedback.individuals?.length > 0 && updatedFeedback.individuals.map((individual) => (
              <div key={individual}>
                <h3 className="text-lg font-semibold mb-2">{individual}</h3>

                <div className="mb-4">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Professionalism Rating</label>
                  <div className="flex justify-between mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name={`professionalism-${individual}`}
                          value={rating}
                          checked={updatedFeedback.professionalism?.[individual] === String(rating)}
                          onChange={(e) => handleRatingChange(e, individual, 'professionalism')}
                          className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rating}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Response Time Rating</label>
                  <div className="flex justify-between mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name={`responseTime-${individual}`}
                          value={rating}
                          checked={updatedFeedback.responseTime?.[individual] === String(rating)}
                          onChange={(e) => handleRatingChange(e, individual, 'responseTime')}
                          className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rating}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Overall Services Rating</label>
                  <div className="flex justify-between mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name={`overallServices-${individual}`}
                          value={rating}
                          checked={updatedFeedback.overallServices?.[individual] === String(rating)}
                          onChange={(e) => handleRatingChange(e, individual, 'overallServices')}
                          className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rating}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Feedback</label>
              <textarea
                name="feedback"
                value={updatedFeedback.feedback}
                onChange={handleChange}
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
                      name="recommend"
                      value={option}
                      checked={updatedFeedback.recommend === option}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;