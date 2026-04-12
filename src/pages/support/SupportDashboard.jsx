import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { CheckCircle, RotateCcw, Package } from 'lucide-react';

export default function SupportDashboard() {
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState('orders');
    const [loading, setLoading] = useState(true);

    // 1. Use useCallback to prevent unnecessary re-renders and ESLint warnings
    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/showAllOrders');
            
            // 2. CRITICAL SAFETY CHECK: Ensure res.data is actually an array
            if (res.data && Array.isArray(res.data)) {
                setOrders(res.data);
            } else {
                console.warn("Backend did not return an array of orders:", res.data);
                setOrders([]); // Fallback to empty array to prevent crash
            }
        } catch (err) { 
            console.error("Failed to fetch orders:", err); 
            setOrders([]); // Fallback to empty array on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === 'orders') {
            loadOrders();
        }
    }, [view, loadOrders]);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/changeOrderStatus?id=${id}&status=${status}`);
            loadOrders(); // Refresh list
        } catch (err) { alert("Failed to update status"); }
    };

    const processReturn = async (id) => {
        try {
            await api.post(`/bookReturn?order_id=${id}`, {});
            alert("Books returned to stock successfully!");
            loadOrders(); // Refresh list
        } catch (err) { alert(err.response?.data || "Return failed"); }
    };

    return (
        <div className="flex h-screen pt-16 bg-surface">
            {/* Sidebar */}
            <div className="w-64 bg-slate-100 p-6 flex flex-col gap-4 border-r border-slate-200">
                <button onClick={() => setView('orders')} className={`p-3 rounded-xl text-left font-bold transition-all ${view==='orders' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-slate-200'}`}>
                    📦 Order Management
                </button>
                <button onClick={() => setView('tickets')} className={`p-3 rounded-xl text-left font-bold transition-all ${view==='tickets' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-slate-200'}`}>
                    🎫 Ticket Queue
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {view === 'orders' ? (
                    <>
                        <div className="flex items-center gap-3 mb-10">
                            <Package size={32} className="text-primary"/>
                            <h1 className="text-3xl font-bold text-slate-800">Order Fulfillment Center</h1>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-slate-500">Loading orders...</div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-material">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                                        <tr>
                                            <th className="p-4">Order ID</th>
                                            <th className="p-4">Student Email</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-20 text-center text-slate-400">
                                                    No orders found in the system.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map(o => (
                                                <tr key={o.order_id} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                                    <td className="p-4 font-bold text-slate-700">#{o.order_id}</td>
                                                    <td className="p-4 text-slate-600">{o.student_email || 'N/A'}</td>
                                                    <td className="p-4">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                                                            {o.status || 'unknown'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 flex justify-end gap-3">
                                                        <button onClick={() => updateStatus(o.order_id, 'shipped')} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Mark as Shipped">
                                                            <CheckCircle size={20}/>
                                                        </button>
                                                        <button onClick={() => processReturn(o.order_id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Process Return">
                                                            <RotateCcw size={20}/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <h2 className="text-2xl font-bold mb-4">Ticket Queue</h2>
                        <p>Ticket Management Interface is currently under maintenance.</p>
                    </div>
                )}
            </div>
        </div>
    );
}