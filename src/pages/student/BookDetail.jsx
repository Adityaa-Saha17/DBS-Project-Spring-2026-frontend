import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Star, BookOpen, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/fetchBook?bookid=${id}`).then(res => setBook(res.data));
    }, [id]);

    if (!book) return <div className="p-20 text-center text-slate-500">Loading book details...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <button onClick={() => navigate('/catalog')} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Catalog
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="aspect-[3/4] bg-slate-200 rounded-3xl flex items-center justify-center shadow-inner border-4 border-white">
                    <BookOpen size={80} className="text-slate-400" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">{book.title}</h1>
                    <p className="text-lg text-slate-500 mb-4">{book.authors}</p>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-yellow-400"><Star size={20} fill="currentColor" /></div>
                        <span className="font-bold text-slate-700">{book.avg_rating}</span>
                        <span className="text-slate-400 text-sm">(Reviews)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                            { l: 'ISBN', v: book.isbn }, { l: 'Publisher', v: book.publisher },
                            { l: 'Format', v: book.format }, { l: 'Language', v: book.language }
                        ].map(item => (
                            <div key={item.l} className="p-3 bg-white rounded-xl border border-slate-100 text-sm">
                                <strong className="text-slate-400 block text-xs uppercase">{item.l}</strong>
                                <span className="text-slate-700">{item.v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <span className="text-3xl font-bold text-primary">${book.price}</span>
                        <button
                            onClick={async () => {
                                try {
                                    console.log("ADDING TO CART:", id);

                                    const res = await api.post('/addToCart',
                                        { bookid: Number(id), quantity: 1 },
                                    );

                                    console.log("SUCCESS:", res.data);
                                    alert("Added to cart!");
                                } catch (err) {
                                    console.error("ERROR:", err);
                                    alert("Failed: " + (err.response?.data || err.message));
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-200"
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Reader Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {book.reviews?.map((rev, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-slate-700">User #{rev.student_id}</span>
                                <div className="flex text-yellow-400"><Star size={16} fill="currentColor" /> {rev.rating}</div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{rev.review_text}</p>
                            <p className="text-xs text-slate-400 mt-4">{rev.review_date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}