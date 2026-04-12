import { useState } from 'react';
import api from '../../api/axios';
import { UserPlus } from 'lucide-react';

export default function UserManagement() {
    const [type, setType] = useState('student');
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', address: '', phone: '',
        university_id: '', department_id: '', dob: '', major: '', status: 'active', year_of_study: 1
    });

    const handleSave = async () => {
        const endpoint = type === 'student' ? '/addStudent' : '/addInstructor';
        try {
            await api.post(endpoint, form);
            alert(`${type} registered successfully!`);
            setForm({});
        } catch (err) { alert("Error: " + (err.response?.data || "Server Error")); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-slate-800">User Registry</h1>
                <div className="flex bg-slate-200 p-1 rounded-2xl">
                    <button onClick={() => setType('student')} className={`px-6 py-2 rounded-xl font-bold transition-all ${type==='student' ? 'bg-white shadow-sm text-primary' : 'text-slate-600'}`}>Students</button>
                    <button onClick={() => setType('instructor')} className={`px-6 py-2 rounded-xl font-bold transition-all ${type==='instructor' ? 'bg-white shadow-sm text-primary' : 'text-slate-600'}`}>Instructors</button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-material grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full flex items-center gap-2 mb-2 text-primary font-bold text-xl">
                    <UserPlus size={24}/> Add New {type === 'student' ? 'Student' : 'Instructor'}
                </div>
                
                <input placeholder="First Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, first_name: e.target.value})} />
                <input placeholder="Last Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, last_name: e.target.value})} />
                <input placeholder="Email" type="email" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, email: e.target.value})} />
                <input placeholder="Phone" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, phone: e.target.value})} />
                <input placeholder="University ID" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, university_id: e.target.value})} />
                
                {type === 'student' ? (
                    <>
                        <input placeholder="DOB (YYYY-MM-DD)" type="date" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, dob: e.target.value})} />
                        <input placeholder="Major" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, major: e.target.value})} />
                        <input placeholder="Year of Study" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, year_of_study: e.target.value})} />
                    </>
                ) : (
                    <input placeholder="Department ID" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, department_id: e.target.value})} />
                )}

                <button onClick={handleSave} className="col-span-full bg-primary text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200 mt-4">
                    Complete Registration
                </button>
            </div>
        </div>
    );
}