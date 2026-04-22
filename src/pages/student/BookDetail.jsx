import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Star, BookOpen, ShoppingCart, ArrowLeft, Tag, Calendar, Layers, Globe, Send } from 'lucide-react';

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    const [reviewForm, setReviewForm] = useState({ rating: 0, review_text: '' });
    const [hovered, setHovered] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/fetchBook?bookid=${id}`).then(res => setBook(res.data));
    }, [id]);

    const handleReviewSubmit = async () => {
        if (reviewForm.rating === 0) return alert('Please select a rating.');
        if (!reviewForm.review_text.trim()) return alert('Please write a review.');
        setSubmitting(true);
        try {
            await api.post('/addReview', {
                book_id: Number(id),
                rating: reviewForm.rating,
                review_text: reviewForm.review_text,
            });
            alert('Review submitted!');
            setReviewForm({ rating: 0, review_text: '' });
            const res = await api.get(`/fetchBook?bookid=${id}`);
            setBook(res.data);
        } catch (err) {
            alert('Failed: ' + (err.response?.data || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (!book) return <div className="p-20 text-center text-slate-500">Loading book details...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <button onClick={() => navigate('/catalog')} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Catalog
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Book Cover Placeholder */}
                <div className="aspect-[3/4] bg-slate-200 rounded-3xl flex items-center justify-center shadow-inner border-4 border-white relative overflow-hidden">
                    <BookOpen size={80} className="text-slate-400" />
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${book.type === 'new' ? 'bg-green-500' : 'bg-orange-500'}`}>
                        {book.type}
                    </div>
                </div>

                {/* Right: Book Info */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">{book.title}</h1>
                    
                    <p className="text-lg text-slate-500 mb-4">
                        by {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-yellow-400"><Star size={20} fill="currentColor" /></div>
                        <span className="font-bold text-slate-700">{book.avg_rating}</span>
                        <span className="text-slate-400 text-sm">({book.reviews?.length || 0} Reviews)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                            { l: 'ISBN', v: book.isbn, icon: <Tag size={14}/> }, 
                            { l: 'Publisher', v: book.publisher },
                            { l: 'Format', v: book.format, icon: <Layers size={14}/> }, 
                            { l: 'Language', v: book.language, icon: <Globe size={14}/> },
                            { l: 'Edition', v: book.edition }, 
                            { l: 'Published', v: book.publication_date, icon: <Calendar size={14}/> },
                            { l: 'Option', v: book.purchase_option }, 
                            { l: 'Category', v: book.category },
                        ].map(item => (
                            <div key={item.l} className="p-3 bg-white rounded-xl border border-slate-100 text-sm flex items-start gap-2">
                                {item.icon && <span className="text-slate-400 mt-0.5">{item.icon}</span>}
                                <div>
                                    <strong className="text-slate-400 block text-xs uppercase">{item.l}</strong>
                                    <span className="text-slate-700">{item.v || 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div>
                            <span className="text-3xl font-bold text-primary">${book.price}</span>
                            <p className={`text-xs font-medium ${book.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {book.quantity > 0 ? `${book.quantity} copies available` : 'Out of Stock'}
                            </p>
                        </div>
                        <button
                            disabled={book.quantity <= 0}
                            onClick={async () => {
                                try {
                                    await api.post('/addToCart', { bookid: Number(id), quantity: 1 });
                                    alert("Added to cart!");
                                } catch (err) {
                                    alert("Failed: " + (err.response?.data || err.message));
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none"
                        >
                            <ShoppingCart size={20} /> {book.quantity > 0 ? 'Add to Cart' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tags Section: Subcategories & Keywords */}
            <div className="mt-12 flex flex-wrap gap-8">
                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Subcategories</h4>
                    <div className="flex flex-wrap gap-2">
                        {book.subcategories?.map((sub, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                {sub}
                            </span>
                        )) || <span className="text-slate-400 text-xs">None</span>}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {book.keywords?.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium border border-indigo-100">
                                {kw}
                            </span>
                        )) || <span className="text-slate-400 text-xs">None</span>}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Reader Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {book.reviews && book.reviews.length > 0 ? (
                        book.reviews.map((rev, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-slate-700">User #{rev.student_id}</span>
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star size={16} fill="currentColor" /> 
                                        <span className="text-slate-700 font-bold">{rev.rating}</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{rev.review_text}</p>
                                <p className="text-xs text-slate-400 mt-4">{rev.review_date}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                            No reviews yet. Be the first to review this book!
                        </div>
                    )}
                </div>

                {/* ── Add Review Form ── */}
                <div className="mt-10 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-800 mb-6">Write a Review</h4>

                    {/* Star Rating Picker */}
                    <div className="mb-5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Rating</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={28}
                                        className="transition-colors"
                                        fill={(hovered || reviewForm.rating) >= star ? '#facc15' : 'none'}
                                        stroke={(hovered || reviewForm.rating) >= star ? '#facc15' : '#cbd5e1'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Review</p>
                        <textarea
                            rows={4}
                            value={reviewForm.review_text}
                            onChange={e => setReviewForm(f => ({ ...f, review_text: e.target.value }))}
                            placeholder="Share your thoughts about this book..."
                            className="w-full p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition"
                        />
                    </div>

                    <button
                        onClick={handleReviewSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none"
                    >
                        <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
}