import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'completed':
      return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/60';
    case 'pending':
      return 'bg-amber-500/20 text-amber-200 border-amber-500/60';
    case 'cancelled':
      return 'bg-red-500/20 text-red-200 border-red-500/60';
    default:
      return 'bg-slate-700/40 text-slate-200 border-slate-500/60';
  }
};

const UserOrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/api/orders/my', {}, token);
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-300">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-2">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-slate-400">
          You haven’t placed any orders yet. Add something to your cart to get started.
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
                  <p className="text-sm text-slate-300">
                    {order.type === 'pickup' ? 'Pickup' : 'Delivery'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status || 'Unknown'}
                  </span>
                  <span className="text-sm font-semibold">
                    ${order.totalAmount?.toFixed(2) ?? '0.00'}
                  </span>
                </div>
              </div>

              {/* Items */}
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

              {/* Delivery vs Pickup info */}
              {order.type === 'delivery' ? (
                <div className="mt-3 border-t border-slate-800 pt-3">
                  <p className="text-xs text-slate-400 mb-1">
                    Delivery details
                  </p>
                  <p className="text-xs text-slate-200">
                    📞 {order.deliveryDetails?.phone || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-200">
                    📍 {order.deliveryDetails?.address || 'No address provided'}
                  </p>
                  {order.deliveryDetails?.notes && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Notes: {order.deliveryDetails.notes}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1">
                      Driver: {order.assignedWorker?.name || 'Unassigned'}
                  </p>
                  {order.deliveryDetails?.allergies && (
                    <p className="text-[11px] text-amber-300 mt-1">
                      Allergies: {order.deliveryDetails.allergies}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-3 border-t border-slate-800 pt-3">
                  <p className="text-xs text-slate-400 mb-1">
                    Pickup location
                  </p>
                  <p className="text-xs text-slate-200">
                    Tasty Bites
                  </p>
                  <p className="text-xs text-slate-300">
                    403 Main St, Grambling, LA 71245
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Please arrive on time and have your order number ready.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
