import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminForm = ({ editMode }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [individualsList, setIndividualsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [showEditIndividuals, setShowEditIndividuals] = useState(editMode === 'individuals');
  const [showEditServices, setShowEditServices] = useState(editMode === 'services');

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

  return (
    <div style={{height:"1000px"}}>
      <header className="flex justify-between items-center mb-8">
      
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
        </div>
      </header>

     

      {showEditIndividuals && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Individuals List</h2>
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
          <div className="bg-white p-4 rounded shadow-md">
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

export default AdminForm;
