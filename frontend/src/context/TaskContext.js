import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  meta: { total: 0, stats: { todo: 0, 'in-progress': 0, done: 0 } },
  loading: false,
  error: null,
  filters: { status: 'all', priority: 'all', search: '', sortBy: 'createdAt', sortOrder: 'desc' },
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR': return { ...state, loading: false, error: action.payload };
    case 'SET_TASKS': return { ...state, loading: false, error: null, tasks: action.payload.data, meta: action.payload.meta };
    case 'ADD_TASK': return {
      ...state,
      tasks: [action.payload, ...state.tasks],
      meta: { ...state.meta, total: state.meta.total + 1, stats: incrementStat(state.meta.stats, action.payload.status) },
    };
    case 'UPDATE_TASK': return {
      ...state,
      tasks: state.tasks.map(t => t._id === action.payload._id ? action.payload : t),
    };
    case 'DELETE_TASK': return {
      ...state,
      tasks: state.tasks.filter(t => t._id !== action.payload.id),
      meta: { ...state.meta, total: state.meta.total - 1, stats: decrementStat(state.meta.stats, action.payload.status) },
    };
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload } };
    default: return state;
  }
}

function incrementStat(stats, status) {
  return { ...stats, [status]: (stats[status] || 0) + 1 };
}
function decrementStat(stats, status) {
  return { ...stats, [status]: Math.max(0, (stats[status] || 0) - 1) };
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (filterOverrides = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = { ...state.filters, ...filterOverrides };
      if (params.status === 'all') delete params.status;
      if (params.priority === 'all') delete params.priority;
      const result = await api.getTasks(params);
      dispatch({ type: 'SET_TASKS', payload: result });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [state.filters]);

  const createTask = useCallback(async (taskData) => {
    const result = await api.createTask(taskData);
    dispatch({ type: 'ADD_TASK', payload: result.data });
    return result;
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    const result = await api.updateTask(id, taskData);
    dispatch({ type: 'UPDATE_TASK', payload: result.data });
    return result;
  }, []);

  const updateTaskStatus = useCallback(async (id, status, currentStatus) => {
    const result = await api.updateTaskStatus(id, status);
    dispatch({ type: 'UPDATE_TASK', payload: result.data });
    return result;
  }, []);

  const deleteTask = useCallback(async (id, status) => {
    await api.deleteTask(id);
    dispatch({ type: 'DELETE_TASK', payload: { id, status } });
  }, []);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  return (
    <TaskContext.Provider value={{ ...state, fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask, setFilters }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used inside TaskProvider');
  return ctx;
}
