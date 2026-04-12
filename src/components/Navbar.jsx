import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Library, Settings } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <Library /> <span>GyanPustak</span>
            </Link>
            <div className="flex items-center gap-6">
                {user?.role === 'student' && <Link to="/catalog" className="text-slate-600 hover:text-primary font-medium">Catalog</Link>}
                {user?.role === 'student' && <Link to="/cart" className="text-slate-600 hover:text-primary font-medium">Cart</Link>}
                {user?.role === 'student' && <Link to="/my-orders" className="text-slate-600 hover:text-primary font-medium">My Orders</Link>}
                {user?.role === 'student' && <Link to="/tickets" className="text-slate-600 hover:text-primary font-medium">Help</Link>}
                
                {user?.role === 'admin' && <Link to="/admin" className="text-slate-600 hover:text-primary font-medium">Admin Panel</Link>}
                {user?.role === 'admin' && <Link to="/admin/users" className="text-slate-600 hover:text-primary font-medium">Users</Link>}
                
                {user?.role === 'support' && <Link to="/support" className="text-slate-600 hover:text-primary font-medium">Support Console</Link>}
                {user?.role === 'superadmin' && <Link to="/superadmin" className="text-slate-600 hover:text-primary font-medium">Staff Mgmt</Link>}
                
                <Link to="/settings" className="text-slate-600 hover:text-primary"><Settings size={20}/></Link>
                
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium hover:bg-red-50 px-3 py-2 rounded-xl transition-all">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
}