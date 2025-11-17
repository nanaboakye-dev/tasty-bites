import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    ordersCount: 0,
    todayOrdersCount: 0,
    menuCount: 0,
    workersCount: 0,

    // NEW stats
    dailyRevenue: 0,
    dailyCount: 0,
    weeklyRevenue: 0,
    weeklyCount: 0,
    monthlyRevenue: 0,
    monthlyCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        // Fetch existing dataset
        const [orders, menu, workers, sales] = await Promise.all([
          apiFetch('/api/orders', {}, token),
          apiFetch('/api/menu'),
          apiFetch('/api/workers', {}, token),
          apiFetch('/api/orders/stats', {}, token), // NEW
        ]);

        // Compute today's orders (same logic as before)
        const today = new Date();
        const todayOrders = orders.filter((o) => {
          if (!o.createdAt) return false;
          const d = new Date(o.createdAt);
          return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          );
        });

        setStats({
          ordersCount: orders.length,
          todayOrdersCount: todayOrders.length,
          menuCount: menu.length,
          workersCount: workers.length,

          // New metrics from backend
          dailyRevenue: sales.daily.total,
          dailyCount: sales.daily.count,

          weeklyRevenue: sales.weekly.total,
          weeklyCount: sales.weekly.count,

          monthlyRevenue: sales.monthly.total,
          monthlyCount: sales.monthly.count,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Admin Dashboard</h1>
        <p className="text-sm text-slate-400">
          Overview of Tasty Bites activity.
        </p>
      </div>

      {/* ===========================
          FIRST ROW — BASIC STATS
          =========================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Total Orders</p>
          <p className="text-2xl font-semibold">
            {loading ? '...' : stats.ordersCount}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Today&apos;s Orders</p>
          <p className="text-2xl font-semibold">
            {loading ? '...' : stats.todayOrdersCount}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Menu Items</p>
          <p className="text-2xl font-semibold">
            {loading ? '...' : stats.menuCount}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Workers</p>
          <p className="text-2xl font-semibold">
            {loading ? '...' : stats.workersCount}
          </p>
        </div>
      </div>

      {/* ===========================
          SECOND ROW — SALES METRICS
          =========================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* DAILY */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Daily Sales</p>
          <p className="text-xl font-semibold mb-1">
            {loading ? '...' : `$${stats.dailyRevenue.toFixed(2)}`}
          </p>
          <p className="text-xs text-slate-500">
            {loading ? '' : `${stats.dailyCount} orders`}
          </p>
        </div>

        {/* WEEKLY */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Weekly Sales</p>
          <p className="text-xl font-semibold mb-1">
            {loading ? '...' : `$${stats.weeklyRevenue.toFixed(2)}`}
          </p>
          <p className="text-xs text-slate-500">
            {loading ? '' : `${stats.weeklyCount} orders`}
          </p>
        </div>

        {/* MONTHLY */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Monthly Sales</p>
          <p className="text-xl font-semibold mb-1">
            {loading ? '...' : `$${stats.monthlyRevenue.toFixed(2)}`}
          </p>
          <p className="text-xs text-slate-500">
            {loading ? '' : `${stats.monthlyCount} orders`}
          </p>
        </div>
      </div>

      {/* ===========================
          NAV LINKS
          =========================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/menu"
          className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 hover:border-red-500/70 hover:shadow-md transition"
        >
          <h2 className="text-sm font-semibold mb-1">Manage Menu</h2>
          <p className="text-xs text-slate-400">
            Add new dishes or remove existing items.
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 hover:border-red-500/70 hover:shadow-md transition"
        >
          <h2 className="text-sm font-semibold mb-1">View Orders</h2>
          <p className="text-xs text-slate-400">
            Monitor all customer orders and statuses.
          </p>
        </Link>

        <Link
          to="/admin/workers"
          className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 hover:border-red-500/70 hover:shadow-md transition"
        >
          <h2 className="text-sm font-semibold mb-1">Workers</h2>
          <p className="text-xs text-slate-400">
            View and manage your restaurant staff list.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
