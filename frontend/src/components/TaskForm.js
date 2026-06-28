import React, { useState, useEffect } from 'react';

const INITIAL = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', tags: '' };

export default function TaskForm({ task, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
      });
    } else {
      setForm(INITIAL);
    }
    setErrors({});
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 200) errs.title = 'Title cannot exceed 200 characters';
    if (form.description.length > 2000) errs.description = 'Description cannot exceed 2000 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    await onSubmit(payload);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className={`form-group ${errors.title ? 'form-group--error' : ''}`}>
        <label className="form-label" htmlFor="title">
          Task Title <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="form-input"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          maxLength={200}
          autoFocus
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
        <span className="char-count">{form.title.length}/200</span>
      </div>

      <div className={`form-group ${errors.description ? 'form-group--error' : ''}`}>
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-input form-textarea"
          placeholder="Add more details (optional)…"
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={2000}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="status">Status</label>
          <select id="status" name="status" className="form-input form-select" value={form.status} onChange={handleChange}>
            <option value="todo">⏳ To Do</option>
            <option value="in-progress">🔄 In Progress</option>
            <option value="done">✅ Done</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="priority">Priority</label>
          <select id="priority" name="priority" className="form-input form-select" value={form.priority} onChange={handleChange}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="form-input"
            value={form.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="tags">Tags <span className="form-hint">(comma-separated)</span></label>
        <input
          id="tags"
          name="tags"
          type="text"
          className="form-input"
          placeholder="e.g. frontend, bug, urgent"
          value={form.tags}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="btn-loading"><span className="spinner-sm" /> Saving…</span>
          ) : task ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
