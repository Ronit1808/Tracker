import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://tracker-auqp.onrender.com/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err.response?.data || err.message);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const createProject = async () => {
    if (!title.trim()) {
      alert('Project title is required');
      return;
    }
    
    setCreateLoading(true);
    try {
      const res = await axios.post('https://tracker-auqp.onrender.com/api/projects', { title }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, res.data]);
      setTitle('');
    } catch (err) {
      console.error('Error creating project:', err.response?.data || err.message);
      alert('Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createProject();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Project Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your projects and tasks in one place</p>
        </div>
        
        {/* Create Project Card */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Create New Project</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  id="projectTitle"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  placeholder="Enter project title"
                />
              </div>
              <button 
                onClick={createProject} 
                disabled={createLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors duration-300 flex items-center disabled:bg-indigo-400"
              >
                {createLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Projects</h2>
          </div>
          
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading projects...</p>
            </div>
          )}
          
          {error && (
            <div className="p-6 bg-red-50 border border-red-200 rounded m-4">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchProjects}
                className="mt-2 text-red-700 hover:text-red-900 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && projects.length === 0 && (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-600">No projects found. Create your first project to get started!</p>
            </div>
          )}
          
          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {projects.map((project) => (
                <div 
                  key={project._id}
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="bg-white border border-gray-200 hover:border-indigo-500 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-4 flex items-start">
                    <div className="bg-indigo-100 rounded-md p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">{project.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">View tasks and details</p>
                    </div>
                    <div className="text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Click to manage tasks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;