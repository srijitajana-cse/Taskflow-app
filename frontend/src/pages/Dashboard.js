import React, { useState, useEffect, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Dashboard({ addToast, darkMode, onToggleDark }) {
  const {
    tasks, meta, loading, error,
    fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask,
    filters, setFilters,
  } = useTaskContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch on mount and whenever filters change
  useEffect(() => {
    fetchTasks(filters);
  }, [filters]); // eslint-disable-line

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleStatusFilter = useCallback((status) => {
    setFilters({ status });
  }, [setFilters]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        addToast('Task updated successfully', 'success');
      } else {
        await createTask(formData);
        addToast('Task created successfully', 'success');
      }
      handleModalClose();
    } catch (err) {
      addToast(err.message || 'Something went wrong', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, status) => {
    try {
      await deleteTask(id, status);
      addToast('Task deleted', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus, currentStatus) => {
    try {
      await updateTaskStatus(id, newStatus, currentStatus);
      addToast(`Marked as ${newStatus.replace('-', ' ')}`, 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.search !== '';

  return (
    <div className="app-layout">
      <Header darkMode={darkMode} onToggleDark={onToggleDark} onAddTask={handleOpenCreate} />

      <main className="main-content">
        <StatsBar
          stats={meta.stats}
          activeFilter={filters.status}
          onFilterClick={handleStatusFilter}
        />

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {error && (
          <div className="error-banner">
            <strong>⚠️ Error:</strong> {error}
            <button className="btn-retry" onClick={() => fetchTasks()}>Retry</button>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : tasks.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onAdd={handleOpenCreate} />
        ) : (
          <>
            <div className="results-count">
              {meta.total} task{meta.total !== 1 ? 's' : ''}
              {hasActiveFilters && ' (filtered)'}
            </div>
            <div className="task-grid">
              {tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleModalClose}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
}
