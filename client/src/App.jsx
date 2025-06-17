import { useState } from 'react';
import { useTaskViewModel } from './hooks/useTaskViewModel';
import { register, login, logout } from './api/authRepository';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { tasks, title, setTitle, description, setDescription, addTask, updateTask, deleteTask } =
    useTaskViewModel(isAuthenticated);

  const handleRegister = async (e) => {
    e.preventDefault();
    //console.log('Registering with:', { username, password }); // Debug
    try {
      await register({ username, password });
      setUsername('');
      setPassword('');
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.map((err) => err.msg).join(', ')
        : error.response?.data?.message || 'Unknown error';
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password }); // Debug
    try {
      await login({ username, password });
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.map((err) => err.msg).join(', ')
        : error.response?.data?.message || 'Unknown error';
      alert(`Login failed: ${errorMessage}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      // Note: setTasks is not defined; remove or fix if needed
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdate = (task) => {
    updateTask(task._id, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Register
          </button>
        </form>
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mb-4"
      >
        Logout
      </button>
      <form onSubmit={addTask} className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="p-2 border rounded"
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Task
        </button>
      </form>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="flex items-center gap-4 p-4 border rounded">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleUpdate(task)}
              className="h-5 w-5"
            />
            <div className="flex-1">
              <span
                className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}
              >
                {task.title}
              </span>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;