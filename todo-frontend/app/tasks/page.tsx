'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiPlus, FiTrash2, FiCheck, FiLogOut, FiMoon, FiSun, FiEdit, FiSave, FiX } from 'react-icons/fi';

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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<{ title: string; description: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

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

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskData({ title: task.title, description: task.description });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskData(null);
  };

  const handleUpdate = async (id: number) => {
    if (!editingTaskData) return;
    try {
      await api.updateTask(id, editingTaskData.title, editingTaskData.description);
      setEditingTaskId(null);
      setEditingTaskData(null);
      loadTasks();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r' from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
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
            className="w-full p-4 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
            required
          />
          <textarea
            placeholder="Add a little more detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
            rows={3}
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r' from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FiPlus />
            <span>Add Task</span>
          </button>
        </form>

        <div className="mb-6 flex justify-center gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors shadow-sm hover:shadow-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors shadow-sm hover:shadow-md ${filter === 'pending' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors shadow-sm hover:shadow-md ${filter === 'completed' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`}
          >
            Completed
          </button>
        </div>

        <div className="space-y-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">No tasks for this filter.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 rounded-xl shadow-md transition-all duration-300 flex items-start justify-between ${
                  task.completed 
                    ? 'bg-gray-200 dark:bg-gray-700 grayscale' // More distinct background and grayscale
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {editingTaskId === task.id ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editingTaskData?.title || ''}
                      onChange={(e) => setEditingTaskData({ ...editingTaskData!, title: e.target.value })}
                      className="w-full p-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                    />
                    <textarea
                      value={editingTaskData?.description || ''}
                      onChange={(e) => setEditingTaskData({ ...editingTaskData!, description: e.target.value })}
                      className="w-full p-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className={`font-bold text-xl transition-colors ${
                        task.completed 
                          ? 'line-through text-gray-500 dark:text-gray-600' // Adjusted text color for completed tasks
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 ml-4">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(task.id)}
                        className="p-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FiSave />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-3 rounded-full text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FiX />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggle(task.id, task.completed)}
                        className={`p-3 rounded-full text-white transition-all duration-300 shadow-md hover:shadow-lg ${
                          task.completed
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}