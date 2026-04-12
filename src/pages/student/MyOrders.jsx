import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { Package, XCircle, Clock } from 'lucide-react';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Wrap in useCallback to fix ESLint warnings and prevent infinite loops
    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/showMyOrders');
            
            // 2. CRITICAL SAFETY CHECK: Ensure res.data is an array
            if (res.data && Array.isArray(res.data)) {
                setOrders(res.data);
            } else {
                console.warn("Backend did not return an array of orders:", res.data);
                setOrders([]); 
            }
        } catch (err) { 
            console.error("Failed to fetch orders:", err); 
            setOrders([]); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const cancelOrder = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await api.post(`/cancelOrder?id=${id}`, {});
            alert("Order cancelled successfully");
            loadOrders(); // Refresh the list to show 'canceled' status
        } catch (err) { 
            alert(err.response?.data || "Cancellation failed"); 
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
                <Package size={32} className="text-primary"/>
                <h1 className="text-3xl font-bold text-slate-800">My Order History</h1>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Clock className="animate-spin mb-4" size={40} />
                    <p className="text-lg">Loading your orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                    You haven't placed any orders yet.
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.order_id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Order ID #{order.order_id}</span>
                                    <p className="text-sm text-slate-500 mt-1">{order.created_date}</p>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                                    order.status === 'new' ? 'bg-blue-100 text-blue-600' : 
                                    order.status === 'canceled' ? 'bg-red-100 text-red-600' : 
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="mb-6 space-y-2">
                                {/* Safety check: Ensure order.items exists before mapping */}
                                {order.items && Array.isArray(order.items) ? (
                                    order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
                                            <span className="text-slate-700">
                                                {item.book_title} <span className="text-slate-400 ml-1">x{item.quantity}</span>
                                            </span>
                                            <span className="text-slate-400 italic">{item.purchase_type}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-slate-400 italic">No items found in this order.</div>
                                )}
                            </div>

                            {order.status === 'new' && (
                                <button 
                                    onClick={() => cancelOrder(order.order_id)} 
                                    className="flex items-center gap-2 text-red-500 text-sm font-bold hover:underline transition-all"
                                >
                                    <XCircle size={16}/> Cancel Order
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}