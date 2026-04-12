import { useState } from 'react';
import api from '../../api/axios';
import { UserPlus } from 'lucide-react';

export default function UserManagement() {
    const [type, setType] = useState('student'); // 'student' or 'instructor'
    const [form, setForm] = useState({
        first_name: '', 
        last_name: '', 
        email: '', 
        address: '', 
        phone: '',
        university_id: '', 
        department_id: '', 
        dobDay: '', 
        dobMonth: '', 
        dobYear: '',
        major: '', 
        status: 'undergraduate', 
        year_of_study: 1
    });

    // --- HELPERS FOR DOB DROPDOWNS ---
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    const handleSave = async () => {
        // 1. Create a copy of the form to avoid mutating state
        const requestData = { ...form };

        // 2. Handle DOB Parsing for Students
        if (type === 'student') {
            if (!form.dobDay || !form.dobMonth || !form.dobYear) {
                alert("Please select a complete Date of Birth");
                return;
            }
            // Format: YYYY-MM-DD
            const year = form.dobYear;
            const month = String(parseInt(form.dobMonth) + 1).padStart(2, '0'); // Month is 0-indexed
            const day = String(form.dobDay).padStart(2, '0');
            requestData.date_of_birth = `${year}-${month}-${day}`;
        }
        console.log(requestData.date_of_birth);

        // 3. Data Type Conversion (Critical for Go Backend)
        requestData.university_id = parseInt(requestData.university_id) || 0;
        
        if (type === 'student') {
            requestData.year_of_study = parseInt(requestData.year_of_study) || 0;
        } else {
            requestData.department_id = parseInt(requestData.department_id) || 0;
        }
        console.log(requestData.status);
        // 4. API Call
        const endpoint = type === 'student' ? '/addStudent' : '/addInstructor';
        try {
            const res = await api.post(endpoint, requestData);
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} registered successfully!\n Temporary Password for you : ${res.data.password}`);
            
            // Reset Form
            setForm({
                first_name: '', last_name: '', email: '', address: '', phone: '',
                university_id: '', department_id: '', dobDay: '', dobMonth: '', dobYear: '',
                major: '', status: 'active', year_of_study: 1
            });
        } catch (err) { 
            alert("Error: " + (err.response?.data || "Server Error")); 
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-slate-800">User Registry</h1>
                <div className="flex bg-slate-200 p-1 rounded-2xl">
                    <button 
                        onClick={() => setType('student')} 
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${type==='student' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:text-slate-800'}`}
                    >
                        Students
                    </button>
                    <button 
                        onClick={() => setType('instructor')} 
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${type==='instructor' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:text-slate-800'}`}
                    >
                        Instructors
                    </button>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-material grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="col-span-full flex items-center gap-2 mb-4 text-primary font-bold text-xl">
                    <UserPlus size={24}/> Add New {type === 'student' ? 'Student' : 'Instructor'}
                </div>
                
                {/* Basic Info Row 1 */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">First Name</label>
                    <input placeholder="John" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, first_name: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">Last Name</label>
                    <input placeholder="Doe" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, last_name: e.target.value})} />
                </div>

                {/* Basic Info Row 2 */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">Email Address</label>
                    <input type="email" placeholder="john@univ.edu" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">Phone Number</label>
                    <input placeholder="+1 234..." className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, phone: e.target.value})} />
                </div>

                {/* University ID Row */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">University ID</label>
                    <input type="number" placeholder="101" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, university_id: e.target.value})} />
                </div>

                {type === 'student' ? (
                    <>
                        {/* DOB Row - perfectly aligned with other inputs */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 ml-1">Date of Birth</label>
                            <div className="flex gap-2 w-full">
                                <select 
                                    className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all bg-white text-sm" 
                                    onChange={e => setForm({...form, dobDay: e.target.value})}
                                >
                                    <option value="">Day</option>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select 
                                    className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all bg-white text-sm" 
                                    onChange={e => setForm({...form, dobMonth: e.target.value})}
                                >
                                    <option value="">Month</option>
                                    {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                                </select>
                                <select 
                                    className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all bg-white text-sm" 
                                    onChange={e => setForm({...form, dobYear: e.target.value})}
                                >
                                    <option value="">Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 ml-1">Major</label>
                            <input placeholder="Computer Science" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, major: e.target.value})} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 ml-1">Year of Study</label>
                            <input type="number" placeholder="1" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, year_of_study: e.target.value})} />
                        </div>
                        
                        {/* Balance spacer for the grid */}
                        <div className="hidden md:block"></div>
                    </>
                ) : (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-400 ml-1">Department ID</label>
                        <input type="number" placeholder="50" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all" onChange={e => setForm({...form, department_id: e.target.value})} />
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    onClick={handleSave} 
                    className="col-span-full bg-primary text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200 mt-4"
                >
                    Complete Registration
                </button>
            </div>
        </div>
    );
}