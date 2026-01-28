import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, LogOut, Loader2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ text: '', href: '', icon: '' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    const checkUser = React.useCallback(() => {
        // Client-side authentication check
        const isAdmin = sessionStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            navigate('/login');
        } else {
            fetchLinks();
        }
    }, [navigate]);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    const fetchLinks = async () => {
        try {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;
            setLinks(data || []);
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin');
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;

        try {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;
            setLinks(links.filter(link => link.id !== id));
        } catch {
            alert('Error deleting link. Ensure database policies allow public writes.');
        }
    };

    const handleEdit = (link) => {
        setFormData({ text: link.text, href: link.href, icon: link.icon || '' });
        setEditingId(link.id);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData({ text: '', href: '', icon: '' });
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing link
                const { data, error } = await supabase
                    .from('links')
                    .update({ ...formData })
                    .eq('id', editingId)
                    .select();

                if (error) throw error;

                setLinks(links.map(link => (link.id === editingId ? data[0] : link)));
            } else {
                // Add new link
                const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.order || 0)) : -1;

                const { data, error } = await supabase
                    .from('links')
                    .insert([{ ...formData, order: maxOrder + 1 }])
                    .select();

                if (error) throw error;

                setLinks([...links, data[0]]);
            }
            resetForm();
        } catch (error) {
            alert('Error saving link: ' + error.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--color-accent)]" />
        </div>
    );

    return (
        <div className="admin-container">
            {/* Background Decor */}
            <div className="bg-decor bg-orb-1"></div>
            <div className="bg-decor bg-orb-2"></div>
            <div className="bg-decor bg-orb-3"></div>

            <header className="admin-header animate-fade-in">
                <h1 className="admin-title">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="logout-button"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </header>

            <div className="admin-links-list">
                {links.map((link) => (
                    <div key={link.id} className="admin-link-card">
                        <div className="link-info">
                            <span className="link-icon">{link.icon}</span>
                            <div className="link-details">
                                <p className="link-text">{link.text}</p>
                                <p className="link-url">{link.href}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(link)}
                                className="edit-button p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                title="Edit Link"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                            </button>
                            <button
                                onClick={() => handleDelete(link.id)}
                                className="delete-button"
                                title="Delete Link"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {links.length === 0 && !isFormOpen && (
                    <div className="empty-state">
                        No links yet. Add one to get started.
                    </div>
                )}
            </div>

            {isFormOpen ? (
                <form onSubmit={handleSubmit} className="add-link-form">
                    <h3 className="form-title">{editingId ? 'Edit Link' : 'Add New Link'}</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Button Text (e.g. Shop Peptides)"
                            className="admin-input"
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            required
                            autoFocus
                        />
                        <input
                            type="url"
                            placeholder="URL (https://...)"
                            className="admin-input"
                            value={formData.href}
                            onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Icon Emoji (e.g. 🛒)"
                            className="admin-input"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        />
                        <div className="form-actions">
                            <button type="submit" className="save-button">
                                {editingId ? 'Update Link' : 'Save Link'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="add-button-trigger"
                >
                    <Plus size={20} /> Add New Link
                </button>
            )}
        </div>
    );
};

export default AdminDashboard;
