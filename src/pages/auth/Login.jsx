import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, GraduationCap, Lock } from 'lucide-react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
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
            alert(err.response?.data || "Invalid email or password"); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-white">
            {/* LEFT SIDE: Branding & Aesthetics (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden p-12 flex-col justify-between text-white">
                {/* Decorative background elements for "Materialist" feel */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-700 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-white text-primary p-2 rounded-2xl shadow-xl">
                            <BookOpen size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Gyanpustak</h1>
                    </div>
                    <div className="max-w-md">
                        <h2 className="text-5xl font-bold leading-tight mb-6">
                            The digital sanctuary for <span className="text-indigo-200">knowledge</span>.
                        </h2>
                        <p className="text-indigo-100 text-lg leading-relaxed">
                            Empowering students and educators with seamless access to the world's finest literary resources.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-indigo-200">
                    <div className="p-2 bg-indigo-800 rounded-lg">
                        <GraduationCap size={24} />
                    </div>
                    <p className="text-sm font-medium">Academic Excellence & Digital Literacy</p>
                </div>
            </div>

            {/* RIGHT SIDE: Functional Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10 lg:text-left lg:mb-12">
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-6 text-primary">
                            <BookOpen size={32} />
                            <span className="text-3xl font-black">Gyanpustak</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Please enter your details to access your portal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-material border border-slate-100 relative transition-all hover:shadow-lg">
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                                <div className="relative">
                                    <input 
                                        type="email" placeholder="name@university.edu" required
                                        className="w-full p-4 pl-11 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-primary transition-all bg-slate-50 focus:bg-white"
                                        onChange={e => setForm({...form, email: e.target.value})}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <span className="text-sm">✉️</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                                <div className="relative">
                                    <input 
                                        type="password" placeholder="••••••••" required
                                        className="w-full p-4 pl-11 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-primary transition-all bg-slate-50 focus:bg-white"
                                        onChange={e => setForm({...form, password: e.target.value})}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                </div>
                            </div>


                            {/*Forgot password reset*/}
                            {/* <div className="flex justify-end">
                                <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot Password?</a>
                            </div> */}

                            <button 
                                disabled={isLoading}
                                className="w-full bg-primary text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-slate-300"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <p className="text-center mt-8 text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} Gyanpustak Digital Library. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}