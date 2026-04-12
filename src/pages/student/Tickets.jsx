import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Send, Ticket as TicketIcon } from 'lucide-react';

export default function Tickets() {
    const [myTickets, setMyTickets] = useState([]);
    const [form, setForm] = useState({ category: '', title: '', description: '' });

    const loadTickets = async () => {
        const res = await api.get('/viewMyTickets');
        setMyTickets(res.data);
    };

    useEffect(() => { loadTickets(); }, []);

    const submitTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/generateTicket', form);
            alert("Ticket submitted successfully!");
            setForm({ category: '', title: '', description: '' });
            loadTickets();
        } catch (err) { alert("Error submitting ticket"); }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-material h-fit sticky top-24">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800"><Send size={24}/> New Support Ticket</h2>
                <form onSubmit={submitTicket} className="space-y-4">
                    <select 
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                        onChange={e => setForm({...form, category: e.target.value})}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Billing">Billing</option>
                        <option value="Technical">Technical</option>
                        <option value="Book Request">Book Request</option>
                        <option value="Other">Other</option>
                    </select>
                    <input 
                        placeholder="Ticket Title" className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                        onChange={e => setForm({...form, title: e.target.value})} required
                    />
                    <textarea 
                        placeholder="Describe your problem in detail..." rows="4" className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                        onChange={e => setForm({...form, description: e.target.value})} required
                    />
                    <button className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
                        Submit Ticket
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800"><TicketIcon size={24}/> My Tickets</h2>
                <div className="space-y-4">
                    {myTickets.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">No tickets found.</div>
                    ) : (
                        myTickets.map((t, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg text-slate-800">{t.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${t.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {t.status}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{t.description}</p>
                                {t.solution_description && (
                                    <div className="p-4 bg-indigo-50 rounded-2xl text-sm text-indigo-700 border border-indigo-100">
                                        <strong className="block mb-1">Resolution:</strong> {t.solution_description}
                                    </div>
                                )}
                                <p className="text-xs text-slate-400 mt-4 uppercase tracking-tighter">{t.created_date}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}