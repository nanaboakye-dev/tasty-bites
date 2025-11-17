import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'delivered':
      return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/60';
    case 'pending':
      return 'bg-amber-500/20 text-amber-200 border-amber-500/60';
    case 'preparing':
      return 'bg-blue-500/20 text-blue-200 border-blue-500/60';
    case 'cancelled':
      return 'bg-red-500/20 text-red-200 border-red-500/60';
    default:
      return 'bg-slate-700/40 text-slate-200 border-slate-500/60';
  }
};

const statusOptions = ['pending', 'preparing', 'delivered', 'completed', 'cancelled'];

const AdminOrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // load all orders + workers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersData, workersData] = await Promise.all([
          apiFetch('/api/orders', {}, token),
          apiFetch('/api/workers', {}, token),
        ]);
        setOrders(ordersData);
        setWorkers(workersData);
      } catch (err) {
        console.error('Failed to fetch admin orders/workers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // change order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await apiFetch(
        `/api/orders/${orderId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        },
        token
      );

      // update in state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch (err) {
      console.error('Failed to update order status', err);
      // Optional: show toast/error
    }
  };

  // assign / unassign worker
  const handleAssignWorker = async (orderId, workerId) => {
    try {
      const body =
        workerId && workerId !== ''
          ? { workerId }
          : { workerId: null }; // allow unassign

      const updated = await apiFetch(
        `/api/orders/${orderId}/assign`,
        {
          method: 'PATCH',
          body: JSON.stringify(body),
        },
        token
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch (err) {
      console.error('Failed to assign worker to order', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-300">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-2">All Orders</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-slate-400">
          No orders have been placed yet.
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-slate-200">
                    {order.user?.name || 'Unknown customer'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {order.user?.email}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    📞 {order.deliveryDetails?.phone || 'No phone on file'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    📍 {order.deliveryDetails?.address || 'No address on file'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ''}
                  </p>
                </div>

                {/* status + controls + worker assignment */}
                <div className="flex flex-col items-end gap-2">
                  {/* current status badge */}
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status || 'Unknown'}
                  </span>

                  {/* dropdown to change status */}
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-[11px] bg-slate-900 border border-slate-700 rounded-full px-2 py-1 text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* order type + total */}
                  <span className="text-xs text-slate-400">
                    {order.type === 'pickup' ? 'Pickup' : 'Delivery'}
                  </span>
                  <span className="text-sm font-semibold">
                    ${order.totalAmount?.toFixed(2) ?? '0.00'}
                  </span>

                  {/* worker assignment */}
                  <div className="mt-1 text-right">
                    <p className="text-[11px] text-slate-400 mb-1">
                      Assigned to:{' '}
                      <span className="text-slate-200">
                        {order.assignedWorker?.name || 'Unassigned'}
                      </span>
                    </p>
                    <select
                      value={order.assignedWorker?._id || ''}
                      onChange={(e) =>
                        handleAssignWorker(order._id, e.target.value)
                      }
                      className="text-[11px] bg-slate-900 border border-slate-700 rounded-full px-2 py-1 text-slate-200 focus:outline-none focus:border-red-500 min-w-[140px]"
                    >
                      <option value="">Unassigned</option>
                      {workers.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.name} ({w.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-400 mb-1">Items</p>
                <ul className="space-y-1 text-xs">
                  {order.items?.map((item) => (
                    <li key={item._id} className="flex justify-between">
                      <span>
                        {item.foodItem?.name || 'Item'} x {item.quantity}
                      </span>
                      <span className="text-slate-400">
                        ${(
                          (item.foodItem?.price || 0) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
