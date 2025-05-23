'use client';

import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update order status function
  const updateOrderStatus = async (ref: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${ref}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update the local orders state with the new status
        setOrders(orders.map((order) =>
          order.reference === ref ? { ...order, status: newStatus } : order
        ));
        setMessage('Order updated successfully');  // Success message
      } else {
        setMessage('Error updating order status'); // Error message
        console.error('Error updating order status');
      }
    } catch (error) {
      setMessage('Error updating order status');  // Error message (optional)
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="text-2xl font-bold text-center">Admin Orders</h1>

      {message && (
        <p className={`text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => {
              setLoading(true);
              fetch('/api/orders')
                .then((res) => res.json())
                .then((data) => setOrders(data))
                .finally(() => setLoading(false));
            }}
          >
            Refresh Orders
          </button>

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Reference</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Coin</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Network</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.reference}>
                  <td className="px-4 py-2 border">{order.reference}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                  <td className="px-4 py-2 border">{order.coin}</td>
                  <td className="px-4 py-2 border">{order.amount}</td>
                  <td className="px-4 py-2 border">{order.network}</td>
                  <td className="px-4 py-2 border">{order.address}</td>
                  <td className="px-4 py-2 border">{order.total}</td>

                  <td className="px-4 py-2 border">
                    {order.status !== 'confirmed' ? (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => updateOrderStatus(order.reference, 'confirmed')}
                      >
                        Confirm Payment
                      </button>
                    ) : (
                      <span className="text-gray-500">Confirmed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
