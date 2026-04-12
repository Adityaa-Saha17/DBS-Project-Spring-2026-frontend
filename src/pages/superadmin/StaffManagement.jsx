import { useState } from 'react';
import api from '../../api/axios';
import { UserPlus, ShieldCheck, Headphones } from 'lucide-react';

export default function StaffManagement() {
    const [role, setRole] = useState('admin');
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', address: '', phone: '',
        gender: '', salary: '', aadhaar_number: ''
    });

    const handleCreateStaff = async () => {
        const endpoint = role === 'admin' ? '/addAdmin' : '/addSupportStaff';
        try {
            const res = await api.post(endpoint, form);
            alert(`Success! User created.\nTemporary Password: ${res.data.password}`);
            setForm({});
        } catch (err) { alert(err); }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Staff Governance</h1>
                <p className="text-slate-500">Create and manage system administrators and support staff</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-material">
                <div className="flex justify-center gap-4 mb-10">
                    <button onClick={() => setRole('admin')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${role==='admin' ? 'bg-primary text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600'}`}>
                        <ShieldCheck size={20}/> Administrator
                    </button>
                    <button onClick={() => setRole('support')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${role==='support' ? 'bg-primary text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600'}`}>
                        <Headphones size={20}/> Support Staff
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input placeholder="First Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, first_name: e.target.value})} />
                    <input placeholder="Last Name" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, last_name: e.target.value})} />
                    <input placeholder="Email" type="email" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, email: e.target.value})} />
                    <input placeholder="Phone" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, phone: e.target.value})} />
                    <input placeholder="Aadhaar Number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, aadhaar_number: e.target.value})} />
                    <input placeholder="Annual Salary" type="number" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, salary: e.target.value})} />
                    <select className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, gender: e.target.value})}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input placeholder="Address" className="p-3 border rounded-xl outline-none focus:ring-2 ring-primary" onChange={e => setForm({...form, address: e.target.value})} />
                </div>

                <button onClick={handleCreateStaff} className="mt-10 w-full bg-primary text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
                    <UserPlus size={20}/> Provision Account
                </button>
            </div>
        </div>
    );
}