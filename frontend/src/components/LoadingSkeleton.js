import React from 'react';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-row">
        <div className="skeleton skeleton--badge" />
        <div className="skeleton skeleton--badge" />
      </div>
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--text" />
      <div className="skeleton skeleton--text skeleton--text-short" />
    </div>
  );
}

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="task-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
