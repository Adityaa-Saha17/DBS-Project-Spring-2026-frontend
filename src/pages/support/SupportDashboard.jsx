import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { CheckCircle, RotateCcw, Package } from 'lucide-react';

export default function SupportDashboard() {
    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
        try {
            const res = await api.get('/showAllOrders');
            setOrders(res.data);
        } catch (err) { console.error("Fetch error", err); }
    };

    useEffect(() => { loadOrders(); }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/changeOrderStatus?id=${id}&status=${status}`);
            loadOrders();
        } catch (err) { alert("Failed to update status"); }
    };

    const processReturn = async (id) => {
        try {
            await api.post(`/bookReturn?order_id=${id}`, {});
            alert("Books returned to stock successfully!");
            loadOrders();
        } catch (err) { alert(err.response?.data || "Return failed"); }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
                <Package size={32} className="text-primary"/>
                <h1 className="text-3xl font-bold text-slate-800">Order Fulfillment Center</h1>
            </div>

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
                            <tr><td colSpan="4" className="p-20 text-center text-slate-400">No orders found in system.</td></tr>
                        ) : (
                            orders.map(o => (
                                <tr key={o.order_id} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                    <td className="p-4 font-bold">#{o.order_id}</td>
                                    <td className="p-4 text-slate-600">{o.student_email}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">{o.status}</span>
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
        </div>
    );
}