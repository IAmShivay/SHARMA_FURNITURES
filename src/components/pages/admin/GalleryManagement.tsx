import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Image, X, Save } from 'lucide-react';
import {
  useGetGalleryItemsQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  GalleryItem,
} from '../../../store/api/galleryApi';

const CATEGORIES = ['living-room', 'bedroom', 'dining', 'kitchen', 'office', 'bathroom', 'outdoor', 'other'];
const TYPES = ['inspiration', 'project'] as const;

const emptyForm = {
  title: '',
  description: '',
  images: [''],
  type: 'inspiration' as const,
  category: 'living-room',
  clientName: '',
  location: '',
  tags: '',
  featured: false,
  published: true,
  order: 0,
};

const GalleryManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterType, setFilterType] = useState('');

  const { data, isLoading } = useGetGalleryItemsQuery({ limit: 50, type: filterType || undefined });
  const [createItem, { isLoading: creating }] = useCreateGalleryItemMutation();
  const [updateItem, { isLoading: updating }] = useUpdateGalleryItemMutation();
  const [deleteItem] = useDeleteGalleryItemMutation();

  const items = data?.data?.items || [];

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: GalleryItem) => {
    setForm({
      title: item.title,
      description: item.description || '',
      images: item.images.length ? item.images : [''],
      type: item.type,
      category: item.category,
      clientName: item.clientName || '',
      location: item.location || '',
      tags: item.tags.join(', '),
      featured: item.featured,
      published: item.published,
      order: item.order,
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      images: form.images.filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingId) {
      await updateItem({ id: editingId, data: payload });
    } else {
      await createItem(payload);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this gallery item?')) {
      await deleteItem(id);
    }
  };

  const addImageField = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImageField = (idx: number) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  const updateImage = (idx: number, val: string) => setForm(f => ({ ...f, images: f.images.map((img, i) => i === idx ? val : img) }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilterType('')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!filterType ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
        <button onClick={() => setFilterType('inspiration')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filterType === 'inspiration' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Inspiration</button>
        <button onClick={() => setFilterType('project')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filterType === 'project' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Projects</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No gallery items yet. Click "Add Item" to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="relative rounded-xl overflow-hidden border border-gray-200 group">
              <img src={item.images[0] || ''} alt={item.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => openEdit(item)} className="bg-white p-2 rounded-full hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item._id)} className="bg-white p-2 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.type === 'project' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span>
                  {item.featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Featured</span>}
                  {!item.published && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">Draft</span>}
                </div>
                <p className="text-sm font-semibold truncate">{item.title}</p>
                <p className="text-xs text-gray-500 capitalize">{item.category.replace('-', ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">{editingId ? 'Edit' : 'Add'} Gallery Item</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Images (Cloudinary URLs)</label>
                {form.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input value={img} onChange={e => updateImage(idx, e.target.value)} placeholder="https://res.cloudinary.com/..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                    {form.images.length > 1 && <button type="button" onClick={() => removeImageField(idx)} className="text-red-500 px-2"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
                <button type="button" onClick={addImageField} className="text-sm text-amber-600 font-medium">+ Add image</button>
              </div>

              {form.type === 'project' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Client Name</label>
                    <input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="modern, minimal, wood" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded" />
                  Published
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={creating || updating} className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm disabled:opacity-50">
                  <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
