import { useState } from 'react';
import api from '../../api/axios';
import { Lock } from 'lucide-react';

export default function Settings() {
    const [form, setForm] = useState({ oldpassword: '', newpassword: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/changePassword', form);
            alert("Password updated! Please login again.");
            window.location.href = '/login';
        } catch (err) { 
            alert(err.response?.data || "Update failed"); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4 pt-16">
            <div className="bg-white p-8 rounded-3xl shadow-material w-full max-w-md border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl"><Lock size={24}/></div>
                    <h2 className="text-2xl font-bold text-slate-800">Account Security</h2>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-1 block">Current Password</label>
                        <input 
                            type="password" className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                            onChange={e => setForm({...form, oldpassword: e.target.value})} required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-1 block">New Password</label>
                        <input 
                            type="password" className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                            onChange={e => setForm({...form, newpassword: e.target.value})} required
                        />
                    </div>
                    <button className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}