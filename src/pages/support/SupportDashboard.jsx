import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { CheckCircle, RotateCcw, Package, Ticket, Send, UserPlus } from 'lucide-react';

export default function SupportDashboard() {
    const [view, setView] = useState('orders'); // 'orders', 'tickets', 'help'
    const [orders, setOrders] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [admins, setAdmins] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    const [helpForm, setHelpForm] = useState({ category: '', title: '', description: '' });
    const [assignForm, setAssignForm] = useState({ ticket_id: '', admin_id: '' });

    // Order Status Constants based on DB Enum
    const ORDER_STATUSES = [
        { value: 'new', label: 'New' },
        { value: 'processed', label: 'Processed' },
        { value: 'awaiting_shipping', label: 'Awaiting Shipping' },
        { value: 'shipped', label: 'Shipped' },
        // { value: 'returned', label: 'Returned' },
    ];

    // --- DATA FETCHING ---

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/showAllOrders');
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("Order fetch error:", err); 
            setOrders([]);
        } finally { 
            setLoading(false); 
        }
    }, []);

    const loadAllTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/viewNewTickets');
            setAllTickets(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("Ticket fetch error:", err); 
            setAllTickets([]);
        } finally { 
            setLoading(false); 
        }
    }, []);

    const loadMyTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/viewMyTickets');
            setMyTickets(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("My tickets fetch error:", err);
            setMyTickets([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadAdmins = useCallback(async () => {
        try {
            const res = await api.get('/fetchAdmins');
            setAdmins(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("Admin fetch error:", err); 
        }
    }, []);

    useEffect(() => {
        if (view === 'orders') loadOrders();
        if (view === 'tickets') {
            loadAllTickets();
            loadAdmins();
        }
        if (view === 'help') loadMyTickets();
    }, [view, loadOrders, loadAllTickets, loadMyTickets, loadAdmins]);

    // --- ACTION HANDLERS ---

    const updateOrderStatus = async (id, status) => {
        try {
            await api.put(`/changeOrderStatus?id=${id}&status=${status}`);
            loadOrders();
        } catch (err) { alert("Failed to update order status"); }
    };

    const processReturn = async (id) => {
        try {
            await api.post(`/bookReturn?order_id=${id}`, {});
            alert("Books returned to stock successfully!");
            loadOrders();
        } catch (err) { alert(err.response?.data || "Return failed"); }
    };

    const handleGenerateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/generateTicket', helpForm);
            alert("Your support ticket has been created!");
            setHelpForm({ category: '', title: '', description: '' });
        } catch (err) { alert("Error generating ticket"); }
    };

    const handleAssignTicket = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ticket_id: parseInt(assignForm.ticket_id, 10),
                admin_id: parseInt(assignForm.admin_id, 10),
            };

            if (isNaN(payload.ticket_id) || isNaN(payload.admin_id)) {
                alert("Invalid ticket or admin selection.");
                return;
            }

            await api.post('/handleNewTicket', payload);
            alert(`Ticket #${payload.ticket_id} has been assigned successfully`);
            setAssignForm({ ticket_id: '', admin_id: '' });
            loadAllTickets();
        } catch (err) { 
            alert("Assignment failed: " + (err.response?.data || "Server Error")); 
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-surface overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-slate-100 p-6 flex flex-col gap-4 border-r border-slate-200">
                <button 
                    onClick={() => setView('orders')} 
                    className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${view==='orders' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    <Package size={20}/> Orders
                </button>
                <button 
                    onClick={() => setView('tickets')} 
                    className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${view==='tickets' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    <Ticket size={20}/> Ticket Queue
                </button>
                <button 
                    onClick={() => setView('help')} 
                    className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${view==='help' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    <Send size={20}/> My Help
                </button>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-8 overflow-y-auto">
                
                {/* VIEW: ORDERS DASHBOARD */}
                {view === 'orders' && (
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
                                            <th className="p-4">Current Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr><td colSpan="4" className="p-20 text-center text-slate-400">No orders found.</td></tr>
                                        ) : (
                                            orders.map(o => (
                                                <tr key={o.order_id} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                                    <td className="p-4 font-bold">#{o.order_id}</td>
                                                    <td className="p-4 text-slate-600">{o.student_email || 'N/A'}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${o.status === 'canceled' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 flex justify-end gap-4 items-center">
                                                        {/* Status Change Dropdown */}
                                                        <div className="flex flex-col items-end">
                                                            <label className="text-[10px] text-slate-400 uppercase font-bold mb-1">Update Status</label>
                                                            <select 
                                                                value={o.status}
                                                                disabled={o.status === 'canceled'}
                                                                onChange={(e) => updateOrderStatus(o.order_id, e.target.value)}
                                                                className={`text-sm p-2 border rounded-lg outline-none transition-all ${o.status === 'canceled' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white hover:border-primary focus:ring-2 ring-primary'}`}
                                                            >
                                                                {ORDER_STATUSES.map(s => (
                                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>


                                                        <button 
                                                            onClick={() => processReturn(o.order_id)} 
                                                            disabled={o.status === 'canceled'}
                                                            className={`p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all ${o.status === 'canceled' ? 'opacity-30 cursor-not-allowed' : ''}`} 
                                                            title="Process Return"
                                                        >
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
                )}

                {/* VIEW: TICKET QUEUE (Triage) */}
                {view === 'tickets' && (
                    <>
                        <div className="flex items-center gap-3 mb-10">
                            <Ticket size={32} className="text-primary"/>
                            <h1 className="text-3xl font-bold text-slate-800">Ticket Triage Queue</h1>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-slate-500">Loading tickets...</div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-material">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                                            <tr>
                                                <th className="p-4">ID</th>
                                                <th className="p-4">Category</th>
                                                <th className="p-4">Title</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allTickets.length === 0 ? (
                                                <tr><td colSpan="5" className="p-20 text-center text-slate-400">No pending tickets.</td></tr>
                                            ) : (
                                                allTickets.map(t => (
                                                    <tr key={t.ticket_id} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                                        <td className="p-4 font-bold">#{t.ticket_id}</td>
                                                        <td className="p-4 text-xs text-slate-500 uppercase">{t.category}</td>
                                                        <td className="p-4 text-slate-700 font-medium">{t.title}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'completed' ? 'bg-green-100 text-green-600' : t.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <button 
                                                                onClick={() => setAssignForm({ ticket_id: t.ticket_id, admin_id: '' })} 
                                                                className="text-primary text-sm font-bold hover:underline"
                                                            >
                                                                Assign
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-material h-fit sticky top-24">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                        <UserPlus size={20} className="text-primary"/> Assign to Admin
                                    </h3>
                                    {assignForm.ticket_id ? (
                                        <form onSubmit={handleAssignTicket} className="space-y-4">
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                                                <p className="text-xs text-slate-400 uppercase font-bold">Target Ticket</p>
                                                <p className="text-lg font-bold text-slate-700">#{assignForm.ticket_id}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 block mb-1">Select Administrator</label>
                                                <select 
                                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all bg-white" 
                                                    value={assignForm.admin_id}
                                                    onChange={e => setAssignForm({...assignForm, admin_id: e.target.value})}
                                                    required
                                                >
                                                    <option value="">Choose an admin...</option>
                                                    {admins.map(admin => (
                                                        <option key={admin.employee_id} value={admin.employee_id}>
                                                            {admin.first_name} {admin.last_name} (ID: {admin.employee_id})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 transition-all">
                                                Confirm Assignment
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setAssignForm({ ticket_id: '', admin_id: '' })}
                                                className="w-full text-slate-400 text-sm hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-10 text-slate-400 italic">
                                            Select a ticket from the queue to assign it.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* VIEW: MY HELP */}
                {view === 'help' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-material h-fit sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <Send size={24} /> New Support Ticket
                            </h2>
                            <form onSubmit={handleGenerateTicket} className="space-y-4">
                                <select
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                                    value={helpForm.category}
                                    onChange={e => setHelpForm({ ...helpForm, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="user_profile">User Profile</option>
                                    <option value="products">Products</option>
                                    <option value="cart">Cart</option>
                                    <option value="orders">Orders</option>
                                    <option value="other">Other</option>
                                </select>
                                <input
                                    placeholder="Ticket Title"
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                                    value={helpForm.title}
                                    onChange={e => setHelpForm({ ...helpForm, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Describe your problem in detail..."
                                    rows="4"
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                                    value={helpForm.description}
                                    onChange={e => setHelpForm({ ...helpForm, description: e.target.value })}
                                    required
                                />
                                <button className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
                                    Submit Ticket
                                </button>
                            </form>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <Send size={24} /> My Tickets
                            </h2>
                            <div className="space-y-4">
                                {myTickets.length === 0 ? (
                                    <div className="text-center py-20 text-slate-400">No tickets found.</div>
                                ) : (
                                    myTickets.map((t, i) => {
                                        const createdDate =
                                            typeof t.created_date === 'object'
                                                ? t.created_date?.String || t.created_date?.Time
                                                : t.created_date;
                                        const solution =
                                            typeof t.solution_description === 'object'
                                                ? t.solution_description?.String
                                                : t.solution_description;
                                        return (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-lg text-slate-800">{t.title || 'Untitled'}</h4>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${t.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        {t.status || 'unknown'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                                    {t.description || 'No description'}
                                                </p>
                                                {solution && (
                                                    <div className="p-4 bg-indigo-50 rounded-2xl text-sm text-indigo-700 border border-indigo-100">
                                                        <strong className="block mb-1">Resolution:</strong>
                                                        {solution}
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-400 mt-4 uppercase tracking-tighter">
                                                    {createdDate ? new Date(createdDate).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}