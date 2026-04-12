import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { Plus, Book, University, GraduationCap, Calendar, Building2, TicketCheck } from 'lucide-react';
import AdminTable from '../../components/AdminTable';

export default function AdminDashboard() {
    const [tab, setTab] = useState('books');
    const [form, setForm] = useState({});
    const [books, setBooks] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [resolveText, setResolveText] = useState('');
    const [status, setStatus] = useState('in-process');

    const inputClass = "p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all";

    // Fetch books for the semesters multi-select
    useEffect(() => {
        if (tab === 'semesters') {
            api.get('/fetchBooks')
                .then(res => setBooks(res.data))
                .catch(() => alert("Failed to load books"));
        }
    }, [tab]);

    // Fetch tickets when ticket tab is open
    const loadTickets = useCallback(async () => {
        try {
            const res = await api.get('/viewALLTickets');
            setAllTickets(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Ticket load error:", err);
        }
    }, []);

    useEffect(() => {
        if (tab === 'tickets') {
            loadTickets();
        }
    }, [tab, loadTickets]);

    const handleSubmit = async (endpoint) => {
        try {
            // Prepare data to ensure numbers are sent as numbers, not strings
            const requestData = { ...form };
            if (requestData.university_id) requestData.university_id = parseInt(requestData.university_id);
            if (requestData.price) requestData.price = parseFloat(requestData.price);
            if (requestData.quantity) requestData.quantity = parseInt(requestData.quantity);
            if (requestData.year) requestData.year = parseInt(requestData.year);
            if (requestData.semester) requestData.semester = parseInt(requestData.semester);
            if (requestData.course_id) requestData.course_id = parseInt(requestData.course_id);
            if (requestData.instructor_id) requestData.instructor_id = parseInt(requestData.instructor_id);

            await api.post(endpoint, requestData);
            alert("Data saved successfully!");
            setForm({});
        } catch (err) {
            alert("Error: " + (err.response?.data || "Server Error"));
        }
    };

    const handleResolveTicket = async () => {
        try {
            await api.post('/changeAssignedTicketStatus', {
                ticket_id: selectedTicket.ticket_id,
                new_status: status,
                solution_description: resolveText
            });
            alert("Ticket updated successfully!");
            setResolveText('');
            setSelectedTicket(null);
            loadTickets();
        } catch (err) {
            alert("Resolution failed: " + (err.response?.data || "Server Error"));
        }
    };

    return (
        <div className="flex h-screen pt-16 bg-surface">
            
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-4">
                <button onClick={() => setTab('books')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'books' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <Book size={20}/> Books
                </button>

                <button onClick={() => setTab('university')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'university' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <University size={20}/> Universities
                </button>

                <button onClick={() => setTab('department')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'department' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <Building2 size={20}/> Departments
                </button>

                <button onClick={() => setTab('courses')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'courses' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <GraduationCap size={20}/> Courses
                </button>

                <button onClick={() => setTab('semesters')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tab === 'semesters' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <Calendar size={20}/> Semesters
                </button>

                <div className="mt-10 pt-10 border-t border-slate-700">
                    <button onClick={() => setTab('tickets')}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full ${tab === 'tickets' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <TicketCheck size={20}/> Ticket Queue
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-8 capitalize">{tab} Management</h2>

                {/* Ticket Resolution Interface */}
                {tab === 'tickets' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow border border-slate-100">
                            <h3 className="text-xl font-bold mb-6">All Tickets</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-sm">
                                        <tr>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Title</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTickets.map(t => (
                                            <tr key={t.ticket_id} className="border-b border-slate-50 hover:bg-slate-50">
                                                <td className="p-3 font-medium">#{t.ticket_id}</td>
                                                <td className="p-3">{t.title}</td>
                                                <td className="p-3">
                                                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button 
                                                        onClick={() => { setSelectedTicket(t); setResolveText(t.solution_description || ''); }}
                                                        className="text-primary font-bold text-sm hover:underline"
                                                    >
                                                        Manage
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow border border-slate-100 h-fit sticky top-24">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TicketCheck size={20} className="text-primary"/> Resolve Ticket
                            </h3>
                            {selectedTicket ? (
                                <div className="space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border text-sm mb-4">
                                        <span className="text-slate-400">Resolving Ticket:</span> <span className="font-bold">#{selectedTicket.ticket_id}</span>
                                    </div>
                                    <select className={inputClass} value={status} onChange={e => setStatus(e.target.value)}>
                                        <option value="assigned">Assigned</option>
                                        <option value="in-process">In Process</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <textarea 
                                        className={`${inputClass} w-full`} 
                                        placeholder="Enter solution description..." 
                                        rows="4"
                                        value={resolveText}
                                        onChange={e => setResolveText(e.target.value)}
                                    />
                                    <button onClick={handleResolveTicket} className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 shadow-lg">
                                        Update Status
                                    </button>
                                </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-400 italic">
                                        Select a ticket from the list to resolve it.
                                    </div>
                                )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* GENERAL FORM SECTION */}
                        <div className="bg-white p-8 rounded-3xl shadow border max-w-4xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Plus size={20}/> Add New Entry
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* ================= BOOKS ================= */}
                                {tab === 'books' && (
                                    <>
                                        <input className={inputClass} placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
                                        <input className={inputClass} placeholder="ISBN" onChange={e => setForm({...form, isbn: e.target.value})} />
                                        <input className={inputClass} placeholder="Publisher" onChange={e => setForm({...form, publisher: e.target.value})} />
                                        <input type="date" className={inputClass} onChange={e => setForm({...form, publication_date: e.target.value})} />
                                        <input className={inputClass} placeholder="Edition" onChange={e => setForm({...form, edition: e.target.value})} />
                                        <input className={inputClass} placeholder="Language" onChange={e => setForm({...form, language: e.target.value})} />
                                        <select className={inputClass} defaultValue="" onChange={e => setForm({...form, format: e.target.value})}>
                                            <option value="" disabled>Select Format</option>
                                            <option value="hardcover">Hardcover</option>
                                            <option value="softcover">Softcover</option>
                                            <option value="electronic">Electronic</option>
                                        </select>
                                        <select className={inputClass} defaultValue="" onChange={e => setForm({...form, type: e.target.value})}>
                                            <option value="" disabled>Select Type</option>
                                            <option value="new">New</option>
                                            <option value="used">Used</option>
                                        </select>
                                        <select className={inputClass} defaultValue="" onChange={e => setForm({...form, purchase_option: e.target.value})}>
                                            <option value="" disabled>Select Purchase Option</option>
                                            <option value="rent">Rent</option>
                                            <option value="buy">Buy</option>
                                        </select>
                                        <input type="number" className={inputClass} placeholder="Price" onChange={e => setForm({...form, price: parseFloat(e.target.value)})} />
                                        <input type="number" className={inputClass} placeholder="Quantity" onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} />
                                        <input className={inputClass} placeholder="Category" onChange={e => setForm({...form, category: e.target.value})} />
                                        <input className={inputClass} placeholder="Subcategories (comma separated)" onChange={e => setForm({...form, subcategories: e.target.value.split(',').map(s => s.trim())})} />
                                        <input className={inputClass} placeholder="Authors (comma separated)" onChange={e => setForm({...form, authors: e.target.value.split(',').map(s => s.trim())})} />
                                        <input className={inputClass} placeholder="Keywords (comma separated)" onChange={e => setForm({...form, keywords: e.target.value.split(',').map(s => s.trim())})} />
                                    </>
                                )}

                                {/* ================= UNIVERSITIES ================= */}
                                {tab === 'university' && (
                                    <>
                                        <input className={inputClass} placeholder="University Name" onChange={e => setForm({...form, name: e.target.value})} />
                                        <input className={inputClass} placeholder="Address" onChange={e => setForm({...form, address: e.target.value})} />
                                        <input className={inputClass} placeholder="Rep First Name" onChange={e => setForm({...form, rep_first_name: e.target.value})} />
                                        <input className={inputClass} placeholder="Rep Last Name" onChange={e => setForm({...form, rep_last_name: e.target.value})} />
                                        <input className={inputClass} placeholder="Rep Email" onChange={e => setForm({...form, rep_email: e.target.value})} />
                                        <input className={inputClass} placeholder="Rep Phone" onChange={e => setForm({...form, rep_phone: e.target.value})} />
                                    </>
                                )}

                                {/* ================= DEPARTMENTS ================= */}
                                {tab === 'department' && (
                                    <>
                                        <input className={inputClass} placeholder="Department Name" onChange={e => setForm({...form, name: e.target.value})} />
                                        <input type="number" className={inputClass} placeholder="University ID" onChange={e => setForm({...form, university_id: parseInt(e.target.value)})} />
                                    </>
                                )}

                                {/* ================= COURSES ================= */}
                                {tab === 'courses' && (
                                    <>
                                        <input className={inputClass} placeholder="Course Name" onChange={e, setForm({...form, name: e.target.value})} />
                                        <input type="number" className={inputClass} placeholder="University ID" onChange={e => setForm({...form, university_id: parseInt(e.target.value)})} />
                                        <input type="number" className={inputClass} placeholder="Year" onChange={e => setForm({...form, year: parseInt(e.target.value)})} />
                                    </>
                                )}

                                {/* ================= SEMESTERS ================= */}
                                {tab === 'semesters' && (
                                    <>
                                        <input type="number" className={inputClass} placeholder="Year" onChange={e => setForm({...form, year: parseInt(e.target.value)})} />
                                        <select className={inputClass} defaultValue="" onChange={e => setForm({...form, season: e.target.value})}>
                                            <option value="" disabled>Select Season</option>
                                            <option value="spring">Spring</option>
                                            <option value="summer">Summer</option>
                                            <option value="fall">Fall</option>
                                            <option value="winter">Winter</option>
                                        </select>
                                        <input type="number" className={inputClass} placeholder="Course ID" onChange={e => setForm({...form, course_id: parseInt(e.target.value)})} />
                                        <input type="number" className={inputClass} placeholder="Instructor ID" onChange={e => setForm({...form, instructor_id: parseInt(e.target.value)})} />
                                        <input type="number" className={inputClass} placeholder="University ID" onChange={e => setForm({...form, university_id: parseInt(e.target.value)})} />
                                        <div className="col-span-2">
                                            <label className="text-sm text-slate-600 mb-1 block">Select Books</label>
                                            <select multiple className={`${inputClass} h-40`} onChange={e => {
                                                const selected = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
                                                setForm({...form, book_ids: selected});
                                            }}>
                                                {books.map(book => (
                                                    <option key={book.id} value={book.id}>{book.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    handleSubmit(
                                        tab === 'books' ? '/addBook' :
                                        tab === 'university' ? '/addUniversity' :
                                        tab === 'department' ? '/addDepartment' :
                                        tab === 'courses' ? '/addCourse' :
                                        '/addSemester'
                                    )
                                }
                                className="mt-8 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 shadow-lg"
                            >
                                Save Record
                            </button>
                        </div>

                        {/* TABLES SECTION */}
                        {tab === 'books' && (
                            <AdminTable
                                fetchUrl="/fetchBooks"
                                deleteUrl="/removeBook"
                                columns={[{ key: 'id', label: 'ID' }, { key: 'title', label: 'Title' }, { key: 'price', label: 'Price' }, { key: 'quantity', label: 'Stock' }]}
                            />
                        )}

                        {tab === 'university' && (
                            <AdminTable
                                fetchUrl="/fetchUniversities"
                                deleteUrl="/removeUniversity"
                                columns={[{ key: 'university_id', label: 'ID' }, { key: 'name', label: 'University' }, { key: 'address', label: 'Address' }]}
                            />
                        )}

                        {tab === 'department' && (
                            <AdminTable
                                fetchUrl="/fetchDepartments" 
                                deleteUrl="/removeDepartment"
                                columns={[{ key: 'department_id', label: 'ID' }, { key: 'name', label: 'Department' }, { key: 'university_id', label: 'Univ ID' }]}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}