import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login', form);
            login({ email: form.email, role: res.data.role });
            
            const routes = { 
                student: '/catalog', 
                admin: '/admin', 
                support: '/support', 
                superadmin: '/superadmin' 
            };
            navigate(routes[res.data.role] || '/catalog');
        } catch (err) { 
            alert(err);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-surface px-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-material w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Sign in to access the library portal</p>
                </div>
                <div className="space-y-4">
                    <input 
                        type="email" placeholder="Email Address" required
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                        onChange={e => setForm({...form, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 ring-primary transition-all"
                        onChange={e => setForm({...form, password: e.target.value})}
                    />
                    <button className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
}