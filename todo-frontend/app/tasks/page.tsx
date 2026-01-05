'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiPlus, FiTrash2, FiCheck, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTasks();
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadTasks = async () => {
    try {
      const response = await api.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.createTask(title, description);
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (error) {
      alert('Failed to create task');
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      await api.toggleTask(id, !completed);
      loadTasks();
    } catch (error) {
      alert('Failed to toggle task');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this task?')) {
      try {
        await api.deleteTask(id);
        loadTasks();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
            My Tasks
          </h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </header>
        
        <form onSubmit={handleCreate} className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-5">Add New Task</h2>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            required
          />
          <textarea
            placeholder="Add a little more detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            rows={3}
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FiPlus />
            <span>Add Task</span>
          </button>
        </form>

        <div className="space-y-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">No tasks yet. Ready to be productive?</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 rounded-xl shadow-md transition-all duration-300 flex items-start justify-between ${
                  task.completed 
                    ? 'bg-white/60 dark:bg-gray-800/60' 
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex-1">
                  <h3 className={`font-bold text-xl transition-colors ${
                      task.completed 
                        ? 'line-through text-gray-400 dark:text-gray-500' 
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className={`p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110 ${
                      task.completed
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <FiCheck />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}