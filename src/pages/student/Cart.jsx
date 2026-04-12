import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Trash2, CreditCard, BookOpen } from 'lucide-react';

export default function Cart() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        api.get('/cart').then(res => setItems(res.data));
    }, []);

    const removeItem = async (bookId) => {
        await api.post('/removeFromCart', { bookid: bookId });
        setItems(items.filter(i => i.id !== bookId));
    };

    const checkout = async (type) => {
        const endpoint = type === 'buy' ? '/placeBuyOrder' : '/placeBorrowOrder';
        try {
            await api.post(endpoint, {});
            alert(`${type} order placed successfully!`);
            setItems([]);
        } catch (err) { alert("Order failed: " + (err.response?.data || "Internal Server Error")); }
    };

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-10 text-slate-800">Shopping Cart</h1>
            {items.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                    Your cart is empty. Start adding books!
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl text-slate-400"><BookOpen size={20}/></div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                                        <p className="text-sm text-slate-500">${item.price} x {item.quantity}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors"><Trash2 size={20}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-material h-fit sticky top-24">
                        <h3 className="text-xl font-bold mb-6 text-slate-800">Order Summary</h3>
                        <div className="flex justify-between mb-8 text-lg font-bold border-b pb-4">
                            <span className="text-slate-500">Total Amount:</span>
                            <span className="text-primary">${total.toFixed(2)}</span>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => checkout('buy')} className="w-full flex items-center justify-center gap-2 bg-primary text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
                                <CreditCard size={20}/> Buy Now
                            </button>
                            <button onClick={() => checkout('rent')} className="w-full bg-slate-100 text-slate-700 p-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                                Borrow Books
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}