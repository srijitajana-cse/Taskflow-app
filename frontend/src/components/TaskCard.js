import React, { useState } from 'react';

const STATUS_CONFIG = {
  'todo':        { label: 'To Do',       class: 'status--todo',        icon: '⏳', next: 'in-progress' },
  'in-progress': { label: 'In Progress', class: 'status--in-progress', icon: '🔄', next: 'done' },
  'done':        { label: 'Done',        class: 'status--done',        icon: '✅', next: 'todo' },
};

const PRIORITY_CONFIG = {
  high:   { label: 'High',   class: 'priority--high',   dot: '🔴' },
  medium: { label: 'Medium', class: 'priority--medium', dot: '🟡' },
  low:    { label: 'Low',    class: 'priority--low',    dot: '🟢' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'done') return false;
  return new Date() > new Date(dateStr);
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const statusInfo = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const overdue = isOverdue(task.dueDate, task.status);

  const handleStatusCycle = async () => {
    setStatusLoading(true);
    await onStatusChange(task._id, statusInfo.next, task.status);
    setStatusLoading(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task._id, task.status);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <article className={`task-card task-card--${task.status} ${overdue ? 'task-card--overdue' : ''}`}>
      <div className="task-card__header">
        <div className="task-card__badges">
          <span className={`badge badge-status ${statusInfo.class}`}>
            {statusInfo.icon} {statusInfo.label}
          </span>
          <span className={`badge badge-priority ${priorityInfo.class}`}>
            {priorityInfo.dot} {priorityInfo.label}
          </span>
        </div>

        <div className="task-card__actions">
          <button
            className="icon-btn icon-btn--status"
            onClick={handleStatusCycle}
            disabled={statusLoading}
            title={`Mark as ${STATUS_CONFIG[statusInfo.next]?.label}`}
          >
            {statusLoading ? <span className="spinner-sm" /> : '↻'}
          </button>
          <button
            className="icon-btn icon-btn--edit"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className={`icon-btn icon-btn--delete ${confirmDelete ? 'icon-btn--confirm' : ''}`}
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
          >
            {confirmDelete ? '⚠️' : '🗑️'}
          </button>
        </div>
      </div>

      <h3 className={`task-card__title ${task.status === 'done' ? 'task-card__title--done' : ''}`}>
        {task.title}
      </h3>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {(task.dueDate || (task.tags && task.tags.length > 0)) && (
        <div className="task-card__footer">
          {task.dueDate && (
            <span className={`task-card__due ${overdue ? 'task-card__due--overdue' : ''}`}>
              {overdue ? '⚠️' : '📅'} {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
          {task.tags && task.tags.length > 0 && (
            <div className="task-card__tags">
              {task.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              {task.tags.length > 3 && <span className="tag tag--more">+{task.tags.length - 3}</span>}
            </div>
          )}
        </div>
      )}

      <div className="task-card__meta">
        Added {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </article>
  );
}
