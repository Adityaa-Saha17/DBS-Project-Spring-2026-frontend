import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ShoppingCart, BookOpen } from 'lucide-react';

export default function BookList() {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/fetchBooks').then(res => setBooks(res.data)).catch(console.error);
    }, []);

    const addToCart = async (bookId) => {
        try {
            await api.post('/addToCart', { bookid: bookId, quantity: 1 });
            alert("Added to cart!");
        } catch (err) { alert("Error adding to cart"); }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-slate-800">Available Library</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.map(book => (
                    <div key={book.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-material shadow-material-hover transition-all group cursor-pointer"
                         onClick={() => navigate(`/book/${book.id}`)}>
                        <div className="h-48 bg-slate-100 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <BookOpen className="text-slate-300 group-hover:text-primary" size={40} />
                        </div>
                        <h3 className="font-bold text-lg truncate text-slate-800">{book.title}</h3>
                        <p className="text-sm text-slate-500 mb-4 truncate">{book.authors}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-primary">${book.price}</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); addToCart(book.id); }}
                                className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all"
                            >
                                <ShoppingCart size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}