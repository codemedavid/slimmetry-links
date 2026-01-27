import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, LogOut, Loader2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLink, setNewLink] = useState({ text: '', href: '', icon: '' });
    const [isAdding, setIsAdding] = useState(false);
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

    const handleAddLink = async (e) => {
        e.preventDefault();
        try {
            const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.order || 0)) : -1;

            const { data, error } = await supabase
                .from('links')
                .insert([{ ...newLink, order: maxOrder + 1 }])
                .select();

            if (error) throw error;

            setLinks([...links, data[0]]);
            setNewLink({ text: '', href: '', icon: '' });
            setIsAdding(false);
        } catch (error) {
            alert('Error adding link: ' + error.message);
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

                        <button
                            onClick={() => handleDelete(link.id)}
                            className="delete-button"
                            title="Delete Link"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {links.length === 0 && !isAdding && (
                    <div className="empty-state">
                        No links yet. Add one to get started.
                    </div>
                )}
            </div>

            {isAdding ? (
                <form onSubmit={handleAddLink} className="add-link-form">
                    <h3 className="form-title">Add New Link</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Button Text (e.g. Shop Peptides)"
                            className="admin-input"
                            value={newLink.text}
                            onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
                            required
                            autoFocus
                        />
                        <input
                            type="url"
                            placeholder="URL (https://...)"
                            className="admin-input"
                            value={newLink.href}
                            onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Icon Emoji (e.g. 🛒)"
                            className="admin-input"
                            value={newLink.icon}
                            onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                        />
                        <div className="form-actions">
                            <button type="submit" className="save-button">
                                Save Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="add-button-trigger"
                >
                    <Plus size={20} /> Add New Link
                </button>
            )}
        </div>
    );
};

export default AdminDashboard;
