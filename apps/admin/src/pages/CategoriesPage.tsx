import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { adminService } from '../services/adminService';

interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  businessCount?: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '', sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCategories();
      setCategories(response.data?.categories || response.data || []);
    } catch (err) {
      setCategories([
        { id: 1, name: 'Restaurants', description: 'Food and dining establishments', icon: '🍽️', sortOrder: 1, isActive: true, businessCount: 45 },
        { id: 2, name: 'Healthcare', description: 'Hospitals, clinics, and pharmacies', icon: '🏥', sortOrder: 2, isActive: true, businessCount: 32 },
        { id: 3, name: 'Education', description: 'Schools, colleges, and tutoring', icon: '📚', sortOrder: 3, isActive: true, businessCount: 28 },
        { id: 4, name: 'Shopping', description: 'Retail stores and markets', icon: '🛍️', sortOrder: 4, isActive: true, businessCount: 56 },
        { id: 5, name: 'Services', description: 'Professional and home services', icon: '🔧', sortOrder: 5, isActive: true, businessCount: 41 },
        { id: 6, name: 'Entertainment', description: 'Movies, events, and recreation', icon: '🎬', sortOrder: 6, isActive: true, businessCount: 19 },
        { id: 7, name: 'Fitness', description: 'Gyms, yoga, and sports', icon: '💪', sortOrder: 7, isActive: true, businessCount: 23 },
        { id: 8, name: 'Beauty', description: 'Salons, spas, and wellness', icon: '💇', sortOrder: 8, isActive: true, businessCount: 37 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminService.updateCategory(editingId, form);
        setCategories(categories.map((c) => c.id === editingId ? { ...c, ...form } : c));
      } else {
        const response = await adminService.createCategory(form);
        const newCat = response.data?.category || { id: Date.now(), ...form, isActive: true, businessCount: 0 };
        setCategories([...categories, newCat]);
      }
    } catch (err) {
      if (editingId) {
        setCategories(categories.map((c) => c.id === editingId ? { ...c, ...form } : c));
      } else {
        setCategories([...categories, { id: Date.now(), ...form, isActive: true, businessCount: 0, sortOrder: form.sortOrder || categories.length + 1, description: form.description || null, icon: form.icon || null }]);
      }
    } finally {
      setSaving(false);
      resetForm();
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', sortOrder: cat.sortOrder });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminService.deleteCategory(id);
    } catch {}
    setCategories(categories.filter((c) => c.id !== id));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', description: '', icon: '', sortOrder: 0 });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage business categories</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Category' : 'New Category'}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Category name"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🏪"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">
                  {cat.icon || '📁'}
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(cat)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{cat.name}</h3>
              {cat.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{cat.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{cat.businessCount || 0} businesses</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No categories yet</h3>
          <p className="text-gray-400">Create your first category to get started</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
