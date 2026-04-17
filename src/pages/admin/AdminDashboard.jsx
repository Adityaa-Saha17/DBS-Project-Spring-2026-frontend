import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { Plus, Book, University, GraduationCap, Calendar, Building2, TicketCheck } from 'lucide-react';
import AdminTable from '../../components/AdminTable';

export default function AdminDashboard() {
    const [tab, setTab] = useState('books');
    const [form, setForm] = useState({});
    const [books, setBooks] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
    const [deptSearch, setDeptSearch] = useState('');
    const [resolveText, setResolveText] = useState('');
    const [ticketTab, setTicketTab] = useState('queue');
    const [ticketViewMode, setTicketViewMode] = useState('details');
    const [bookDropdownOpen, setBookDropdownOpen] = useState(false);
    const [bookSearch, setBookSearch] = useState('');
    const [universities, setUniversities] = useState([]);
    const [courses, setCourses] = useState([]);

    const inputClass = "p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all";

    useEffect(() => {
        if (tab === 'semesters') {
            api.get('/fetchBooks')
                .then(res => setBooks(Array.isArray(res.data) ? res.data : []))
                .catch(() => alert("Failed to load books"));

            api.get('/fetchInstructor')
                .then(res => setInstructors(Array.isArray(res.data) ? res.data : []))
                .catch(() => alert("Failed to load instructors"));
        }
        if (tab === 'courses' || tab === 'department' || tab === 'semesters') {
            api.get('/fetchUniversities')
                .then(res => setUniversities(Array.isArray(res.data) ? res.data : []))
                .catch(() => alert("Failed to load universities"));
        }
    }, [tab]);

    const fetchDepartmentsByUni = async (uniId) => {
        if (!uniId) return;
        try {
            const res = await api.get(`/fetchDepartments?university_id=${uniId}`);
            const data = Array.isArray(res.data) ? res.data : [];
            console.log("Departments loaded:", data); // Debugging: Check if data arrives here
            setDepartments(data); // This trigger the UI re-render
        } catch (err) {
            console.error("Error fetching departments:", err);
        }
    };

    const fetchCoursesByUni = async (uniId) => {
        if (!uniId) return;
        try {
            // Assuming your backend endpoint /fetchCourses supports ?university_id=
            const res = await api.get(`/fetchCourses?university_id=${uniId}`);
            setCourses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

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
            setBookSearch('');
            setBookDropdownOpen(false);
            setDeptSearch('');
            setDeptDropdownOpen(false);
        } catch (err) {
            alert("Error: " + (err.response?.data || "Server Error"));
        }
    };

    const updateTicketStatus = async (newStatus, solution = '') => {
        try {
            await api.post('/changeAssignedTicketStatus', {
                ticket_id: selectedTicket.ticket_id,
                new_status: newStatus,
                solution_description: solution
            });
            alert(`Ticket updated to ${newStatus}!`);
            setResolveText('');
            setSelectedTicket(null);
            setTicketViewMode('details'); // Reset view
            loadTickets(); // Refresh the list
        } catch (err) {
            alert("Update failed: " + (err.response?.data || "Server Error"));
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-surface overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-4 h-full">
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

                {tab === 'tickets' ? (
                    <div className="flex flex-col gap-6">
                        {/* SUB-TABS for Tickets */}
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setTicketTab('queue')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${ticketTab === 'queue' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                            >
                                Ticket Queue
                            </button>
                            <button 
                                onClick={() => setTicketTab('resolved')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${ticketTab === 'resolved' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                            >
                                Resolved Tickets
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* LEFT COLUMN: TABLE */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow border border-slate-100">
                                <h3 className="text-xl font-bold mb-6 capitalize">{ticketTab} Tickets</h3>
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
                                            {allTickets
                                                .filter(t => ticketTab === 'queue' ? t.status !== 'completed' : t.status === 'completed')
                                                .map(t => (
                                                    <tr key={t.ticket_id} className="border-b border-slate-50 hover:bg-slate-50">
                                                        <td className="p-3 font-medium">#{t.ticket_id}</td>
                                                        <td className="p-3">{t.title}</td>
                                                        <td className="p-3">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-3">
                                                            <button 
                                                                onClick={() => { setSelectedTicket(t); setTicketViewMode('details'); }}
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

                            {/* RIGHT COLUMN: INTERACTIVE PANEL */}
                            <div className="bg-white p-6 rounded-3xl shadow border border-slate-100 h-fit sticky top-24">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TicketCheck size={20} className="text-primary"/> Ticket Details
                                </h3>

                                {selectedTicket ? (
                                    <div className="space-y-6">
                                        {/* TICKET INFO CARD - Always Visible */}
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-sm">
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-slate-400">Ticket ID:</span>
                                                <span className="font-bold">#{selectedTicket.ticket_id}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-slate-400">Category:</span>
                                                <span className="font-semibold">{selectedTicket.category}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-slate-400">Status:</span>
                                                <span className="font-bold uppercase text-xs text-primary">{selectedTicket.status}</span>
                                            </div>
                                            <div className="pt-2">
                                                <span className="text-slate-400 block mb-1">Created By:</span>
                                                <div className="flex flex-col">
                                                    <span className="font-medium block text-slate-800">
                                                        {selectedTicket.generated_by}
                                                    </span>
                                                    <span className="text-xs text-slate-500 truncate">
                                                        {selectedTicket.generated_by_email || 'No email provided'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <span className="text-slate-400 block mb-1">Issue:</span>
                                                <p className="text-slate-700 italic leading-relaxed">"{selectedTicket.description}"</p>
                                            </div>
                                        </div>

                                        {/* CONDITIONAL ACTION AREA */}
                                        {ticketViewMode === 'details' ? (
                                            <div className="pt-4">
                                                {selectedTicket.status === 'assigned' && (
                                                    <button 
                                                        onClick={() => updateTicketStatus('in-process')}
                                                        className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 shadow-lg transition-all"
                                                    >
                                                        Accept Ticket / Take Job
                                                    </button>
                                                )}

                                                {selectedTicket.status === 'in-process' && (
                                                    <button 
                                                        onClick={() => setTicketViewMode('resolve')}
                                                        className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 shadow-lg transition-all"
                                                    >
                                                        Submit Solution/Remarks
                                                    </button>
                                                )}

                                                {selectedTicket.status === 'completed' && (
                                                    <div className="p-3 bg-green-50 text-green-600 text-center rounded-xl text-sm font-bold border border-green-100">
                                                        This ticket is already resolved.
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* RESOLUTION INPUT AREA */
                                            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-right-4">
                                                <button 
                                                    onClick={() => setTicketViewMode('details')}
                                                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-bold transition-all"
                                                >
                                                    ← Back to Details
                                                </button>
                                                <textarea 
                                                    className={`${inputClass} w-full`} 
                                                    placeholder="Describe the solution provided to the user..." 
                                                    rows="5"
                                                    value={resolveText}
                                                    onChange={e => setResolveText(e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        if(!resolveText) return alert("Please enter a solution description");
                                                        updateTicketStatus('completed', resolveText);
                                                    }} 
                                                    className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition-all"
                                                >
                                                    Complete Ticket
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-400 italic">
                                        Select a ticket from the list to manage it.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white p-8 rounded-3xl shadow border max-w-4xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Plus size={20}/> Add New Entry
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

                                {tab === 'department' && (
                                    <>
                                        <input className={inputClass} placeholder="Department Name" onChange={e => setForm({...form, name: e.target.value})} />
                                        <select 
                                            className={inputClass} 
                                            defaultValue="" 
                                            onChange={e => {
                                                const uniId = parseInt(e.target.value);
                                                setForm({ ...form, university_id: uniId });
                                            }}
                                        >
                                            <option value="" disabled>Select University</option>
                                            {universities.map(uni => (
                                                <option key={uni.university_id} value={uni.university_id}>
                                                    {uni.name}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}

                                {tab === 'courses' && (
                                    <>
                                        <input className={inputClass} placeholder="Course Name" onChange={e => setForm({...form, name: e.target.value})} />
                                        
                                        <select 
                                            className={inputClass} 
                                            defaultValue="" 
                                            onChange={e => {
                                                const uniId = parseInt(e.target.value);
                                                setForm({ ...form, university_id: uniId });
                                                fetchDepartmentsByUni(uniId);
                                            }}
                                        >
                                            <option value="" disabled>Select University</option>
                                            {universities.map(uni => (
                                                <option key={uni.university_id} value={uni.university_id}>
                                                    {uni.name}
                                                </option>
                                            ))}
                                        </select>
                                        
                                        <input type="number" className={inputClass} placeholder="Year" onChange={e => setForm({...form, year: parseInt(e.target.value)})} />

                                        <div className="col-span-2 relative">
                                            <label className="text-sm text-slate-600 mb-1 block">Select Departments</label>

                                            {/* Trigger button */}
                                            <button
                                                type="button"
                                                onClick={() => setDeptDropdownOpen(prev => !prev)}
                                                className={`${inputClass} w-full text-left flex justify-between items-center bg-white`}
                                            >
                                                <span className="truncate text-sm text-slate-700">
                                                    {/* CHANGED: department_ids -> departments */}
                                                    {form.departments?.length
                                                        ? `${form.departments.length} department(s) selected`
                                                        : 'Select departments...'}
                                                </span>
                                                <span className="ml-2 text-slate-400 text-xs">{deptDropdownOpen ? '▲' : '▼'}</span>
                                            </button>

                                            {/* Selected department tags */}
                                            {/* CHANGED: department_ids -> departments */}
                                            {form.departments?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {form.departments.map(id => {
                                                        const dept = departments.find(d => d.department_id === id);
                                                        return (
                                                            <span key={id} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                                                {dept?.name ?? `Dept #${id}`}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setForm({
                                                                        ...form,
                                                                        // CHANGED: department_ids -> departments
                                                                        departments: form.departments.filter(d => d !== id)
                                                                    })}
                                                                    className="ml-1 hover:text-red-500 font-bold"
                                                                >x</button>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Dropdown panel */}
                                            {deptDropdownOpen && (
                                                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 flex flex-col">
                                                    {/* Search */}
                                                    <div className="p-2 border-b border-slate-100">
                                                        <input
                                                            className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 ring-primary"
                                                            placeholder="Search departments..."
                                                            value={deptSearch}
                                                            onChange={e => setDeptSearch(e.target.value)}
                                                        />
                                                    </div>

                                                    {/* Department list */}
                                                    <div className="overflow-y-auto flex-1">
                                                        {departments
                                                            .filter(dept => dept.name.toLowerCase().includes(deptSearch.toLowerCase()))
                                                            .map(dept => {
                                                                const deptId = dept.department_id;
                                                                // CHANGED: department_ids -> departments
                                                                const isSelected = (form.departments || []).includes(deptId);
                                                                return (
                                                                    <label
                                                                        key={deptId}
                                                                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isSelected}
                                                                            onChange={() => {
                                                                                // CHANGED: department_ids -> departments
                                                                                const current = form.departments || [];
                                                                                const updated = isSelected
                                                                                    ? current.filter(d => d !== deptId)
                                                                                    : [...current, deptId];
                                                                                setForm({ ...form, departments: updated });
                                                                            }}
                                                                            className="accent-primary"
                                                                        />
                                                                        <span>{dept.name}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        {departments.length === 0 && (
                                                            <div className="p-4 text-center text-xs text-slate-400 italic">
                                                                Please enter a valid University ID to load departments.
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="p-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                                                        {/* CHANGED: department_ids -> departments */}
                                                        <span>{form.departments?.length || 0} selected</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeptDropdownOpen(false)}
                                                            className="text-primary font-bold hover:underline"
                                                        >
                                                            Done
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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

                                        <select
                                            className={inputClass}
                                            defaultValue=""
                                            onChange={e => setForm({...form, instructor_id: parseInt(e.target.value)})}
                                        >
                                            <option value="" disabled>Select Instructor</option>
                                            {instructors.map(inst => (
                                                <option key={inst.instructor_id} value={inst.instructor_id}>
                                                    {inst.first_name} {inst.last_name}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className={inputClass} 
                                            defaultValue="" 
                                            onChange={e => {
                                                const uniId = parseInt(e.target.value);
                                                setForm({ ...form, university_id: uniId, course_id: "" }); 
                                                fetchCoursesByUni(uniId);
                                            }}
                                        >
                                            <option value="" disabled>Select University</option>
                                            {universities.map(uni => (
                                                <option key={uni.university_id} value={uni.university_id}>
                                                    {uni.name}
                                                </option>
                                            ))}
                                        </select>

                                        <select 
                                            className={inputClass} 
                                            value={form.course_id || ""} 
                                            onChange={e => setForm({...form, course_id: parseInt(e.target.value)})}
                                        >
                                            <option value="" disabled>Select Course</option>
                                            {courses.map(course => (
                                                <option key={course.course_id} value={course.course_id}>
                                                    {course.name}
                                                </option>
                                            ))}
                                            {courses.length === 0 && universities.length > 0 && (
                                                <option disabled>No courses found for this university</option>
                                            )}
                                        </select>

                                        {/* ======= NEW: Book Checkbox Dropdown ======= */}
                                        <div className="col-span-2 relative">
                                            <label className="text-sm text-slate-600 mb-1 block">Select Books</label>

                                            {/* Trigger button */}
                                            <button
                                                type="button"
                                                onClick={() => setBookDropdownOpen(prev => !prev)}
                                                className={`${inputClass} w-full text-left flex justify-between items-center bg-white`}
                                            >
                                                <span className="truncate text-sm text-slate-700">
                                                    {form.book_ids?.length
                                                        ? `${form.book_ids.length} book(s) selected`
                                                        : 'Select books...'}
                                                </span>
                                                <span className="ml-2 text-slate-400 text-xs">{bookDropdownOpen ? '▲' : '▼'}</span>
                                            </button>

                                            {/* Selected book tags */}
                                            {form.book_ids?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {form.book_ids.map(id => {
                                                        const book = books.find(b => (b.book_id ?? b.id) === id);
                                                        return (
                                                            <span key={id} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                                                {book?.title ?? `Book #${id}`}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setForm({
                                                                        ...form,
                                                                        book_ids: form.book_ids.filter(b => b !== id)
                                                                    })}
                                                                    className="ml-1 hover:text-red-500 font-bold"
                                                                >×</button>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Dropdown panel */}
                                            {bookDropdownOpen && (
                                                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 flex flex-col">
                                                    {/* Search */}
                                                    <div className="p-2 border-b border-slate-100">
                                                        <input
                                                            className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 ring-primary"
                                                            placeholder="Search books..."
                                                            value={bookSearch}
                                                            onChange={e => setBookSearch(e.target.value)}
                                                        />
                                                    </div>

                                                    {/* Book list */}
                                                    <div className="overflow-y-auto flex-1">
                                                        {books
                                                            .filter(book => book.title.toLowerCase().includes(bookSearch.toLowerCase()))
                                                            .map(book => {
                                                                const bookId = book.book_id ?? book.id;
                                                                const isSelected = (form.book_ids || []).includes(bookId);
                                                                return (
                                                                    <label
                                                                        key={bookId}
                                                                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isSelected}
                                                                            onChange={() => {
                                                                                const current = form.book_ids || [];
                                                                                const updated = isSelected
                                                                                    ? current.filter(b => b !== bookId)
                                                                                    : [...current, bookId];
                                                                                setForm({ ...form, book_ids: updated });
                                                                            }}
                                                                            className="accent-primary"
                                                                        />
                                                                        <span>{book.title}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="p-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                                                        <span>{form.book_ids?.length || 0} selected</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setBookDropdownOpen(false)}
                                                            className="text-primary font-bold hover:underline"
                                                        >
                                                            Done
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* ======= END: Book Checkbox Dropdown ======= */}
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
                        {/*TABLES*/}
                        {tab === 'books' && (
                            <AdminTable
                                fetchUrl="/fetchBooks"
                                deleteUrl="/removeBook"
                                columns={[
                                    { key: 'id', label: 'ID' },
                                    { key: 'title', label: 'Title' },
                                    { key: 'price', label: 'Price' },
                                    { 
                                        key: 'quantity', 
                                        label: 'Stock', 
                                        render: (val) => val === 0 ? (
                                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                                                Out of Stock
                                            </span>
                                        ) : val 
                                    }
                                ]}
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
                                columns={[{ key: 'department_id', label: 'ID' }, { key: 'name', label: 'Department' }, { key: 'university_name', label: 'University Name' }]}
                            />
                        )}

                        {tab === 'courses' && (
                            <AdminTable
                                fetchUrl="/fetchCourses"
                                deleteUrl="/removeCourse"
                                deleteParam="id"
                                columns={[
                                    { key: 'course_id',       label: 'ID' },
                                    { key: 'name',            label: 'Course' },
                                    { key: 'year',            label: 'Year' },
                                    { key: 'university_name', label: 'University' },
                                    {
                                        key: 'departments',
                                        label: 'Departments',
                                        render: (val) => Array.isArray(val) ? val.join(', ') : (val ?? '—')
                                    },
                                ]}
                            />
                        )}

                        {tab === 'semesters' && (
                            <AdminTable
                                fetchUrl="/fetchSemesters"
                                deleteUrl="/removeSemester"
                                deleteParam="id"
                                columns={[
                                    { key: 'sem_id',          label: 'ID' },
                                    { key: 'course_name',     label: 'Course' },
                                    { key: 'instructor_name', label: 'Instructor' },
                                    { key: 'season',          label: 'Season' },
                                    { key: 'year',            label: 'Year' },
                                    { key: 'university_name', label: 'University' },
                                    {
                                        key: 'books',
                                        label: 'Books',
                                        render: (val) => Array.isArray(val) ? val.join(', ') : (val ?? '—')
                                    },
                                ]}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}