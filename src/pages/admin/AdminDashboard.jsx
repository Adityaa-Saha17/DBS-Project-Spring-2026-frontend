import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Book, University, GraduationCap, Calendar } from 'lucide-react';
import AdminTable from '../../components/AdminTable';

export default function AdminDashboard() {
    const [tab, setTab] = useState('books');
    const [form, setForm] = useState({});
    const [books, setBooks] = useState([]);

    const inputClass = "p-3 border rounded-xl outline-none focus:ring-2 ring-primary";

    // Fetch books when semesters tab opens
    useEffect(() => {
        if (tab === 'semesters') {
            api.get('/fetchBooks')
                .then(res => setBooks(res.data))
                .catch(() => alert("Failed to load books"));
        }
    }, [tab]);

    const handleSubmit = async (endpoint) => {
        try {
            console.log(form);
            await api.post(endpoint, form);
            alert("Data saved successfully!");
            setForm({});
        } catch (err) {
            alert("Error: " + (err.response?.data || "Server Error"));
        }
    };

    return (
        <div className="flex h-screen pt-16 bg-surface">
            
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-4">
                <button onClick={() => setTab('books')}
                    className={`flex items-center gap-3 p-3 rounded-xl ${tab === 'books' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <Book size={20}/> Books
                </button>

                <button onClick={() => setTab('univ')}
                    className={`flex items-center gap-3 p-3 rounded-xl ${tab === 'univ' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <University size={20}/> Universities
                </button>

                <button onClick={() => setTab('courses')}
                    className={`flex items-center gap-3 p-3 rounded-xl ${tab === 'courses' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <GraduationCap size={20}/> Courses
                </button>

                <button onClick={() => setTab('semesters')}
                    className={`flex items-center gap-3 p-3 rounded-xl ${tab === 'semesters' ? 'bg-primary' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <Calendar size={20}/> Semesters
                </button>
            </div>

            {/* Main */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-8 capitalize">{tab} Management</h2>

                {/* FORM */}
                <div className="bg-white p-8 rounded-3xl shadow border max-w-4xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Plus size={20}/> Add New Entry
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* ================= BOOKS ================= */}
                        {tab === 'books' && (
                            <>
                                <input className={inputClass} placeholder="Title"
                                    onChange={e => setForm({...form, title: e.target.value})} />

                                <input className={inputClass} placeholder="ISBN"
                                    onChange={e => setForm({...form, isbn: e.target.value})} />

                                <input className={inputClass} placeholder="Publisher"
                                    onChange={e => setForm({...form, publisher: e.target.value})} />

                                {/* DATE PICKER */}
                                <input
                                    type="date"
                                    className={inputClass}
                                    onChange={e => {
                                        const formatted = e.target.value.replaceAll('-', '/');
                                        setForm({...form, publication_date: formatted});
                                    }}
                                />

                                <input className={inputClass} placeholder="Edition"
                                    onChange={e => setForm({...form, edition: e.target.value})} />

                                <input className={inputClass} placeholder="Language"
                                    onChange={e => setForm({...form, language: e.target.value})} />

                                {/* ENUM DROPDOWNS */}
                                <select className={inputClass}
                                    defaultValue=""
                                    onChange={e => setForm({...form, format: e.target.value})}>
                                    <option value="" disabled>Select Format</option>
                                    <option value="hardcover">Hardcover</option>
                                    <option value="softcover">Softcover</option>
                                    <option value="electronic">Electronic</option>
                                </select>

                                <select className={inputClass}
                                    defaultValue=""
                                    onChange={e => setForm({...form, type: e.target.value})}>
                                    <option value="" disabled>Select Type</option>
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                </select>

                                <select className={inputClass}
                                    defaultValue=""
                                    onChange={e => setForm({...form, purchase_option: e.target.value})}>
                                    <option value="" disabled>Select Purchase Option</option>
                                    <option value="rent">Rent</option>
                                    <option value="buy">Buy</option>
                                </select>

                                <input type="number" className={inputClass} placeholder="Price"
                                    onChange={e => setForm({...form, price: parseFloat(e.target.value)})} />

                                <input type="number" className={inputClass} placeholder="Quantity"
                                    onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} />

                                <input className={inputClass} placeholder="Category"
                                    onChange={e => setForm({...form, category: e.target.value})} />

                                <input className={inputClass} placeholder="Subcategories (comma separated)"
                                    onChange={e => setForm({...form, subcategories: e.target.value.split(',').map(s => s.trim())})} />

                                <input className={inputClass} placeholder="Authors (comma separated)"
                                    onChange={e => setForm({...form, authors: e.target.value.split(',').map(s => s.trim())})} />

                                <input className={inputClass} placeholder="Keywords (comma separated)"
                                    onChange={e => setForm({...form, keywords: e.target.value.split(',').map(s => s.trim())})} />
                            </>
                        )}

                        {/* ================= UNIVERSITIES ================= */}
                        {tab === 'univ' && (
                            <>
                                <input className={inputClass} placeholder="University Name"
                                    onChange={e => setForm({...form, name: e.target.value})} />

                                <input className={inputClass} placeholder="Address"
                                    onChange={e => setForm({...form, address: e.target.value})} />

                                <input className={inputClass} placeholder="Rep First Name"
                                    onChange={e => setForm({...form, rep_first_name: e.target.value})} />

                                <input className={inputClass} placeholder="Rep Last Name"
                                    onChange={e => setForm({...form, rep_last_name: e.target.value})} />
                                
                                <input className={inputClass} placeholder="Rep Email"
                                    onChange={e => setForm({...form, rep_email: e.target.value})} />
                                
                                <input className={inputClass} placeholder="Rep Phone"
                                    onChange={e => setForm({...form, rep_phone: e.target.value})} />
                            </>
                        )}

                        {/* ================= COURSES ================= */}
                        {tab === 'courses' && (
                            <>
                                <input className={inputClass} placeholder="Course Name"
                                    onChange={e => setForm({...form, name: e.target.value})} />

                                <input type="number" className={inputClass} placeholder="University ID"
                                    onChange={e => setForm({...form, university_id: parseInt(e.target.value)})} />

                                <input type="number" className={inputClass} placeholder="Year"
                                    onChange={e => setForm({...form, year: parseInt(e.target.value)})} />

                                <input type="number" className={inputClass} placeholder="Semester"
                                    onChange={e => setForm({...form, semester: parseInt(e.target.value)})} />
                            </>
                        )}

                        {/* ================= SEMESTERS ================= */}
                        {tab === 'semesters' && (
                            <>
                                <input type="number" className={inputClass} placeholder="Year"
                                    onChange={e => setForm({...form, year: parseInt(e.target.value)})} />

                                <select className={inputClass}
                                    defaultValue=""
                                    onChange={e => setForm({...form, season: e.target.value})}>
                                    <option value="" disabled>Select Season</option>
                                    <option value="spring">Spring</option>
                                    <option value="summer">Summer</option>
                                    <option value="fall">Fall</option>
                                    <option value="winter">Winter</option>
                                </select>

                                <input type="number" className={inputClass} placeholder="Course ID"
                                    onChange={e => setForm({...form, course_id: parseInt(e.target.value)})} />

                                <input type="number" className={inputClass} placeholder="Instructor ID"
                                    onChange={e => setForm({...form, instructor_id: parseInt(e.target.value)})} />

                                <input type="number" className={inputClass} placeholder="University ID"
                                    onChange={e => setForm({...form, university_id: parseInt(e.target.value)})} />

                                {/* BOOK MULTI SELECT */}
                                <div className="col-span-2">
                                    <label className="text-sm text-slate-600 mb-1 block">
                                        Select Books
                                    </label>

                                    <select
                                        multiple
                                        className={`${inputClass} h-40`}
                                        onChange={e => {
                                            const selected = Array.from(e.target.selectedOptions)
                                                .map(option => parseInt(option.value));
                                            setForm({...form, book_ids: selected});
                                        }}
                                    >
                                        {books.map(book => (
                                            <option key={book.id} value={book.id}>
                                                {book.title} {/* name shown */}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        onClick={() =>
                            handleSubmit(
                                tab === 'books' ? '/addBook' :
                                tab === 'univ' ? '/addUniversity' :
                                tab === 'courses' ? '/addCourse' :
                                '/addSemester'
                            )
                        }
                        className="mt-8 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 shadow-lg"
                    >
                        Save Record
                    </button>
                </div>

                {/* TABLES */}
                {tab === 'books' && (
                    <AdminTable
                        fetchUrl="/fetchBooks"
                        deleteUrl="/removeBook"
                        columns={[
                            { key: 'id', label: 'ID' },
                            { key: 'title', label: 'Title' },
                            { key: 'price', label: 'Price' },
                            { key: 'quantity', label: 'Stock' }
                        ]}
                    />
                )}
            </div>
        </div>
    );
}