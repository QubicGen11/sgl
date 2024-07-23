import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Form from './Components/Form';
import FeedbackDetails from './Components/FeedbackDetails';
import Admin from './Components/Admin';

const App = () => {
  return (
    <BrowserRouter>
    
        {/* <nav className="mb-8">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-500">Submit Feedback</Link>
            </li>
            <li>
              <Link to="/feedback-details" className="text-blue-500">Feedback Details</Link>
            </li>
            <li>
              <Link to="/admin" className="text-blue-500">Admin</Link>
            </li>
          </ul>
        </nav> */}

        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/all" element={<FeedbackDetails />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      
    </BrowserRouter>
  );
}

export default App;