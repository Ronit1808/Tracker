import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectTasks = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', status: 'Pending' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://tracker-auqp.onrender.comapi/tasks/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Fetched tasks:', res.data);
            setTasks(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tasks:', err.response?.data || err.message);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const createTask = async () => {
        if (!form.title.trim()) {
            alert('Task title is required');
            return;
        }
        
        try {
            const res = await axios.post(`https://tracker-auqp.onrender.comapi/tasks/${projectId}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Created task:', res.data);
            await fetchTasks();
            setForm({ title: '', description: '', status: 'Pending' });
        } catch (err) {
            console.error('Error creating task:', err.response?.data || err.message);
            alert('Failed to create task');
        }
    };

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', status: 'Pending' });

    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditForm({ title: task.title, description: task.description, status: task.status });
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditForm({ title: '', description: '', status: 'Pending' });
    };

    const updateTask = async (taskId) => {
        if (!editForm.title.trim()) {
            alert('Task title is required');
            return;
        }
        
        try {
            await axios.put(
                `https://tracker-auqp.onrender.comapi/tasks/${taskId}`,
                editForm,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            await fetchTasks();
            cancelEditing();
        } catch (err) {
            console.error('Error updating task:', err.response?.data || err.message);
            alert('Failed to update task');
        }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        try {
            await axios.delete(`https://tracker-auqp.onrender.comapi/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
        } catch (err) {
            console.error('Error deleting task:', err.response?.data || err.message);
            alert('Failed to delete task');
        }
    };

    // Get counts by status
    const statusCounts = {
        Pending: tasks.filter(task => task.status === 'Pending').length,
        'In Progress': tasks.filter(task => task.status === 'In Progress').length,
        Completed: tasks.filter(task => task.status === 'Completed').length
    };

    // Status color mapping
    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
        'Completed': 'bg-green-100 text-green-800 border-green-200'
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Project Tasks</h1>
                    <Link to="/dashboard">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </Link>
                </div>

                {/* Task statistics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-yellow-500 font-semibold mb-1">Pending</div>
                        <div className="text-3xl font-bold">{statusCounts.Pending}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-blue-500 font-semibold mb-1">In Progress</div>
                        <div className="text-3xl font-bold">{statusCounts['In Progress']}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-green-500 font-semibold mb-1">Completed</div>
                        <div className="text-3xl font-bold">{statusCounts.Completed}</div>
                    </div>
                </div>

                {/* Create task card */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="border-b border-gray-200 p-4">
                        <h2 className="text-xl font-semibold text-gray-800">Create New Task</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                placeholder="Enter task title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                placeholder="Enter task description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 min-h-[80px]"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button
                            onClick={createTask}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors duration-300 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="border-b border-gray-200 p-4">
                        <h2 className="text-xl font-semibold text-gray-800">Task List</h2>
                    </div>
                    
                    {loading && (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading tasks...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-6 bg-red-50 border border-red-200 rounded m-4">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    
                    {!loading && !error && tasks.length === 0 && (
                        <div className="p-8 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-600">No tasks found. Create a new task to get started!</p>
                        </div>
                    )}
                    
                    <ul className="divide-y divide-gray-200">
                        {tasks
                            .filter((task) => task && task._id)
                            .map((task) => (
                                <li key={task._id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                                    {editingTaskId === task._id ? (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-medium text-blue-800 mb-3">Edit Task</h3>
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                <input
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="border border-gray-300 p-2 w-full rounded-md"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="border border-gray-300 p-2 w-full rounded-md min-h-[80px]"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                <select
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                    className="border border-gray-300 p-2 w-full rounded-md"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateTask(task._id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors duration-300"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md transition-colors duration-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600 mt-2 mb-4">
                                                {task.description ? task.description : <span className="text-gray-400 italic">No description provided</span>}
                                            </p>
                                            
                                            <div className="flex gap-4 mt-2">
                                                <button
                                                    onClick={() => startEditing(task)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-300"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task._id)}
                                                    className="text-red-600 hover:text-red-800 font-medium flex items-center transition-colors duration-300"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProjectTasks;