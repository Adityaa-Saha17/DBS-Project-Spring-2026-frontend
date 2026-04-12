import { useState } from 'react';
import api from '../../api/axios';
import { Plus, Book, University, GraduationCap, Calendar } from 'lucide-react';
import AdminTable from '../../components/AdminTable';

export default function AdminDashboard() {
    const [tab, setTab] = useState('books');
    const [form, setForm] = useState({});

    const handleSubmit = async (endpoint) => {
        try {
            await api.post(endpoint, form);
            alert("Data saved successfully!");
            setForm({});
        } catch (err) { alert("Error: " + (err.response?.data || "Server Error")); }
    };

    return (
        <div className="flex h-screen pt-16 bg-surface">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-4">
                <button onClick={() => setTab('books')} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'books' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <Book size={20} /> Books
                </button>
                <button onClick={() => setTab('univ')} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'univ' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <University size={20} /> Universities
                </button>
                <button onClick={() => setTab('courses')} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'courses' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <GraduationCap size={20} /> Courses
                </button>
                <button onClick={() => setTab('semesters')} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'semesters' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <Calendar size={20} /> Semesters
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-8 text-slate-800 capitalize">{tab} Management</h2>
                
                <div className="bg-white p-8 rounded-3xl shadow-material border border-slate-100 max-w-4xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700"><Plus size={20}/> Add New Entry</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tab === 'books' && (
                            <>
                                <input placeholder="Title" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, title: e.target.value})} />
                                <input placeholder="ISBN" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, isbn: e.target.value})} />
                                <input placeholder="Category" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, category: e.target.value})} />
                                <input placeholder="Price" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, price: e.target.value})} />
                                <input placeholder="Quantity" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, quantity: e.target.value})} />
                                <input placeholder="Publisher" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, publisher: e.target.value})} />
                            </>
                        )}
                        {tab === 'univ' && (
                            <>
                                <input placeholder="University Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, name: e.target.value})} />
                                <input placeholder="Address" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, address: e.target.value})} />
                                <input placeholder="Rep First Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, rep_first_name: e.target.value})} />
                                <input placeholder="Rep Last Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, rep_last_name: e.target.value})} />
                            </>
                        )}
                        {tab === 'courses' && (
                            <>
                                <input placeholder="Course Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, name: e.target.value})} />
                                <input placeholder="University ID" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, university_id: e.target.value})} />
                                <input placeholder="Year" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, year: e.target.value})} />
                                <input placeholder="Semester" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, semester: e.target.value})} />
                            </>
                        )}
                    </div>
                    <button 
                        onClick={() => handleSubmit(tab === 'books' ? '/addBook' : tab === 'univ' ? '/addUniversity' : '/addCourse')}
                        className="mt-8 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200"
                    >
                        Save Record
                    </button>
                </div>

                {/* Data List Section */}
                {tab === 'books' && (
                    <AdminTable 
                        fetchUrl="/fetchBooks" 
                        deleteUrl="/removeBook" 
                        columns={[{ key: 'id', label: 'ID' }, { key: 'title', label: 'Title' }, { key: 'price', label: 'Price' }, { key: 'quantity', label: 'Stock' }]} 
                    />
                )}
                {tab === 'univ' && (
                    <AdminTable 
                        fetchUrl="/fetchUniversities" // Ensure this endpoint is added to your Go backend
                        deleteUrl="/removeUniversity" 
                        columns={[{ key: 'id', label: 'ID' }, { key: 'name', label: 'University' }, { key: 'address', label: 'Address' }]} 
                    />
                )}
            </div>
        </div>
    );
}