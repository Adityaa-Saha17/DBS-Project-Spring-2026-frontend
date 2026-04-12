import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, Edit } from 'lucide-react';

export default function AdminTable({ fetchUrl, deleteUrl, columns }) {
    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const res = await api.get(fetchUrl);
            setData(res.data);
        } catch (err) { console.error("Fetch error", err); }
    };

    useEffect(() => { loadData(); }, [fetchUrl]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await api.delete(`${deleteUrl}?id=${id}`);
            setData(data.filter(item => item.id !== id));
            alert("Deleted successfully");
        } catch (err) { alert("Delete failed"); }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                    <tr>
                        {columns.map(col => <th key={col.key} className="p-4">{col.label}</th>)}
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr><td colSpan={columns.length + 1} className="p-10 text-center text-slate-400">No records found</td></tr>
                    ) : (
                        data.map((item, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                {columns.map(col => (
                                    <td key={col.key} className="p-4 text-slate-700">{item[col.key]}</td>
                                ))}
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}