import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRatings from 'react-star-ratings';

interface Interview {
  _id: string;
  name: string;
  status: 'Pending' | 'Complete';
  feedback: string;
  rating: number;
}

const Dashboard: React.FC = () => {
    const nav = useNavigate();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [newInterview, setNewInterview] = useState<Interview | null>(null);
  
    useEffect(() => {
      fetchInterviews();
    }, []);
  
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/interviews', {
          headers: {
            Authorization: token ? `${token}` : '',
          },
        });
        setInterviews(res.data.interviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        alert('Token Expired. Please sign in again.');
        nav('/');
      }
    };
  
    const handleAddNewInterview = () => {
      setNewInterview({
        _id: '',
        name: '',
        status: 'Pending',
        feedback: '',
        rating: 0,
      });
    };
  
    const handleEditInterview = (interview: Interview) => {
      setNewInterview(interview);
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (newInterview) {
          setNewInterview({
            ...newInterview,
            [name]: value,
          });
        }
      };
      
  
    const handleSaveInterview = async () => {
      try {
        if (!newInterview) return;
        const token = localStorage.getItem('token');
        if (newInterview._id) {
          await axios.put(`http://localhost:5000/api/interviews/${newInterview._id}`, newInterview, {
            headers: {
              Authorization: token ? `${token}` : '',
            },
          });
        } else {
          await axios.post('http://localhost:5000/api/interviews', newInterview, {
            headers: {
              Authorization: token ? `${token}` : '',
            },
          });
        }
        fetchInterviews();
        setNewInterview(null);
      } catch (error) {
        console.error('Error saving interview:', error);
        alert('Failed to save interview. Please try again later.');
      }
    };
  
    const handleDeleteInterview = async (id: string) => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/interviews/${id}`, {
          headers: {
            Authorization: token ? `${token}` : '',
          },
        });
        fetchInterviews();
      } catch (error) {
        console.error('Error deleting interview:', error);
        alert('Failed to delete interview. Please try again later.');
      }
    };
    const handleSignOut = () => {
      localStorage.removeItem('token');
      nav('/');
    };
  
    return (
      <div className="bg-gray-900 text-white p-8 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Interviews</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddNewInterview}
          >
            Add New
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSignOut}
            >
              Sign Out
          </button>
        </div>
  
        {newInterview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Name:</label>
              <input
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                type="text"
                name="name"
                value={newInterview.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2">Status:</label>
              <select
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                name="status"
                value={newInterview.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Feedback:</label>
              <textarea
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                name="feedback"
                value={newInterview.feedback}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2">Rating:</label>
              <input
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                type="number"
                name="rating"
                value={newInterview.rating}
                min={0}
                max={5}
                onChange={handleChange}
              />
            </div>
            <div className="block mb-2">
              <label className="block mb-2 opacity-0">Rating:</label>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                onClick={handleSaveInterview}
              >
                Save
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setNewInterview(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
  
        {/* Interview Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Interview Status</th>
              <th className="text-left p-2">Interview Feedback</th>
              <th className="text-left p-2">Rating</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview, index) => (
              <tr key={index} className="bg-gray-900 text-white">
                <td className="p-2">{interview.name}</td>
                <td className="p-2">{interview.status}</td>
                <td className="p-2">{interview.feedback}</td>
                <td className="p-2">
                  <StarRatings
                    rating={interview.rating}
                    starDimension="20px"
                    starSpacing="2px"
                    starRatedColor="yellow"
                  />
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                    onClick={() => handleEditInterview(interview)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleDeleteInterview(interview._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Dashboard;
