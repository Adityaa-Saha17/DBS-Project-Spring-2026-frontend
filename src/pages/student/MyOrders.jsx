import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Package, XCircle } from 'lucide-react';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get('/showMyOrders')
            .then(res => {
                console.log("ORDERS:", res.data);
                setOrders(res.data);
            })
            .catch(err => {
                console.error("ERROR:", err);
            });
    }, []);
    const cancelOrder = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await api.post(`/cancelOrder?id=${id}`, {});
            setOrders(orders.map(o => o.order_id === id ? { ...o, status: 'canceled' } : o));
            alert("Order cancelled successfully");
        } catch (err) { alert(err.response?.data); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-10 text-slate-800">My Order History</h1>
            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">No orders found.</div>
                ) : (
                    orders.map(order => (
                        <div key={order.order_id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Order ID #{order.order_id}
                                    </span>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {order.created_date?.String || "N/A"}
                                    </p>
                                </div>

                                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'new'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="mb-6 space-y-2">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
                                        <span className="text-slate-700">{item.book_title} <span className="text-slate-400 ml-1">x{item.quantity}</span></span>
                                        <span className="text-slate-400 italic">{item.purchase_type}</span>
                                    </div>
                                ))}
                            </div>
                            {order.status === 'new' && (
                                <button onClick={() => cancelOrder(order.order_id)} className="flex items-center gap-2 text-red-500 text-sm font-bold hover:underline transition-all">
                                    <XCircle size={16} /> Cancel Order
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}