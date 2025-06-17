//Manages state and API calls using React hooks.
//Only loads tasks if authenticated.
//Acts as Controller in MVC architecture.

import { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/taskRepository';

export const useTaskViewModel = (isAuthenticated) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isAuthenticated) loadTasks();
  }, [isAuthenticated]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTask = await createTask({ title, description });
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskById = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTaskById = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return {
    tasks,
    title,
    setTitle,
    description,
    setDescription,
    addTask,
    updateTask: updateTaskById,
    deleteTask: deleteTaskById,
  };
};