import React from 'react';

const SchedulesTable = ({ schedules, loading, onDelete }) => {
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (startIso, endIso) => {
    if (!startIso || !endIso) return '';
    const start = new Date(startIso);
    const end = new Date(endIso);
    const diffMs = end - start;
    if (diffMs <= 0 || Number.isNaN(diffMs)) return '';

    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
  };

  if (loading) {
    return <p className="text-sm text-slate-400">Loading schedules...</p>;
  }

  if (!schedules || schedules.length === 0) {
    return <p className="text-sm text-slate-400">No schedules added yet.</p>;
  }

  const handleDeleteClick = (id) => {
    if (!onDelete) return;
    const ok = window.confirm('Are you sure you want to delete this schedule?');
    if (ok) onDelete(id);
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-slate-900/80 border border-slate-800">
      <table className="min-w-full text-xs text-left">
        <thead className="bg-slate-950/70 border-b border-slate-800">
          <tr>
            <th className="px-3 py-2 font-semibold text-slate-300">Worker</th>
            <th className="px-3 py-2 font-semibold text-slate-300 hidden sm:table-cell">
              Role
            </th>
            <th className="px-3 py-2 font-semibold text-slate-300 hidden md:table-cell">
              Phone
            </th>
            <th className="px-3 py-2 font-semibold text-slate-300">Date</th>
            <th className="px-3 py-2 font-semibold text-slate-300">Start</th>
            <th className="px-3 py-2 font-semibold text-slate-300">End</th>
            <th className="px-3 py-2 font-semibold text-slate-300 hidden sm:table-cell">
              Duration
            </th>
            <th className="px-3 py-2 font-semibold text-slate-300 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {schedules.map((s) => (
            <tr key={s._id} className="hover:bg-slate-800/50">
              <td className="px-3 py-2 text-slate-100">
                {s.worker?.name || 'Unknown worker'}
              </td>
              <td className="px-3 py-2 text-slate-300 hidden sm:table-cell">
                {s.worker?.role || '—'}
              </td>
              <td className="px-3 py-2 text-slate-400 hidden md:table-cell">
                {s.worker?.phone || '—'}
              </td>
              <td className="px-3 py-2 text-slate-200">
                {formatDate(s.start)}
              </td>
              <td className="px-3 py-2 text-slate-200">
                {formatTime(s.start)}
              </td>
              <td className="px-3 py-2 text-slate-200">
                {formatTime(s.end)}
              </td>
              <td className="px-3 py-2 text-slate-300 hidden sm:table-cell">
                {formatDuration(s.start, s.end) || '—'}
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => handleDeleteClick(s._id)}
                  className="text-[11px] text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulesTable;
