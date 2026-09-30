import React, { useState, useRef } from 'react';
import { Plus, Eye, Trash2, Search, X, Save, Printer, CheckCircle, FileText, Upload, Loader2 } from 'lucide-react';
import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useMarkPaidMutation,
  Invoice,
} from '../../../store/api/invoiceApi';
import { formatCurrency } from '../../../utils/formatters';
import { useAppSelector } from '../../../store/hooks';

const SELLER_DEFAULTS = {
  sellerName: 'LuxeHome - Sharma Furnitures',
  sellerAddress: 'Arrah Shree Pally, Durgapur, West Bengal 713212',
  sellerPhone: '+91 8918349445',
  sellerEmail: 'hello@formiqstudio.in',
  sellerGstin: '',
  sellerPan: '',
  sellerLogo: '',
};

const SERVICE_PRESETS = [
  { name: 'Modular Kitchen', hsnCode: '9403' },
  { name: 'Interior Design', hsnCode: '9983' },
  { name: 'Door Frame', hsnCode: '4418' },
  { name: 'Window Frame', hsnCode: '4418' },
  { name: 'CPVC Work', hsnCode: '3917' },
  { name: 'Wardrobe', hsnCode: '9403' },
  { name: 'Complete Home Furnishing', hsnCode: '9403' },
  { name: 'Custom Furniture', hsnCode: '9403' },
  { name: 'Sofa Set', hsnCode: '9401' },
  { name: 'Bed Frame', hsnCode: '9403' },
  { name: 'Dining Table Set', hsnCode: '9403' },
  { name: 'TV Unit', hsnCode: '9403' },
  { name: 'Study Table', hsnCode: '9403' },
  { name: 'Dressing Table', hsnCode: '9403' },
  { name: 'Shoe Rack', hsnCode: '9403' },
  { name: 'Bookshelf', hsnCode: '9403' },
  { name: 'Guitar Stand', hsnCode: '9403' },
  { name: 'Laptop Table', hsnCode: '9403' },
  { name: 'Plant Stand', hsnCode: '9403' },
  { name: 'Side Table', hsnCode: '9403' },
  { name: 'False Ceiling', hsnCode: '6809' },
  { name: 'Wall Paneling', hsnCode: '4411' },
  { name: 'Flooring Work', hsnCode: '6907' },
  { name: 'Painting & Finishing', hsnCode: '9988' },
  { name: 'Electrical Fitting', hsnCode: '9954' },
  { name: 'Plumbing Work', hsnCode: '9954' },
  { name: 'Consultation Fee', hsnCode: '9983' },
  { name: 'Design & Planning Fee', hsnCode: '9983' },
  { name: 'Delivery & Installation', hsnCode: '9967' },
];

const emptyItem = { name: '', description: '', hsnCode: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 18, taxAmount: 0, total: 0 };

const DEFAULT_TERMS = `1. Payment is due within 15 days of invoice date.
2. Late payments may incur 2% monthly interest.
3. Goods once sold will not be taken back.
4. Subject to Durgapur jurisdiction.
5. E&OE (Errors and Omissions Excepted).`;

const emptyForm = {
  ...SELLER_DEFAULTS,
  type: 'standard' as const,
  buyerName: '', buyerAddress: '', buyerPhone: '', buyerEmail: '', buyerGstin: '',
  items: [{ ...emptyItem }],
  shipping: 0,
  notes: '',
  termsAndConditions: DEFAULT_TERMS,
  placeOfSupply: 'West Bengal',
  dueDate: '',
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700', sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700', cancelled: 'bg-gray-100 text-gray-500',
};
const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700',
  partial: 'bg-orange-100 text-orange-700', refunded: 'bg-red-100 text-red-700',
};

const InvoiceManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading } = useGetInvoicesQuery({ search, status: statusFilter || undefined });
  const [createInvoice, { isLoading: creating }] = useCreateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [markPaid] = useMarkPaidMutation();

  const invoices = data?.data?.invoices || [];
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('images', file);
    try {
      const res = await fetch(`${apiUrl}/upload?folder=invoices`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data.urls[0]) {
        setForm(f => ({ ...f, sellerLogo: data.data.urls[0] }));
      }
    } catch (err) {
      console.error('Logo upload failed:', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const addPresetItem = (preset: typeof SERVICE_PRESETS[0]) => {
    setForm(f => ({
      ...f,
      items: [...f.items, { ...emptyItem, name: preset.name, hsnCode: preset.hsnCode }],
    }));
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...emptyItem }] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx: number, field: string, value: any) => {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, items };
    });
    if (errors[`item_${idx}_${field}`]) {
      setErrors(e => { const n = { ...e }; delete n[`item_${idx}_${field}`]; return n; });
    }
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.buyerName.trim()) e.buyerName = 'Customer name is required';
    if (!form.buyerEmail.trim()) e.buyerEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail)) e.buyerEmail = 'Invalid email format';
    if (!form.buyerPhone.trim()) e.buyerPhone = 'Phone is required';
    else {
      let digits = form.buyerPhone.replace(/[^\d]/g, '');
      if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
      if (digits.length !== 10) e.buyerPhone = 'Phone must be exactly 10 digits';
    }
    if (!form.buyerAddress.trim()) e.buyerAddress = 'Address is required';
    if (form.buyerGstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.buyerGstin)) e.buyerGstin = 'Invalid GSTIN format';

    form.items.forEach((item, idx) => {
      if (!item.name.trim()) e[`item_${idx}_name`] = 'Item name required';
      if (item.quantity < 1) e[`item_${idx}_quantity`] = 'Min 1';
      if (item.unitPrice <= 0) e[`item_${idx}_unitPrice`] = 'Price must be > 0';
      if (item.discount < 0 || item.discount > 100) e[`item_${idx}_discount`] = '0-100%';
      if (item.taxRate < 0 || item.taxRate > 28) e[`item_${idx}_taxRate`] = '0-28%';
    });

    if (form.items.length === 0) e.items = 'At least one item required';
    if (form.shipping < 0) e.shipping = 'Cannot be negative';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const calcTotals = () => {
    let subtotal = 0, taxTotal = 0;
    form.items.forEach(item => {
      const itemSub = item.quantity * item.unitPrice;
      const discount = (itemSub * (item.discount || 0)) / 100;
      const taxable = itemSub - discount;
      const tax = (taxable * (item.taxRate || 18)) / 100;
      subtotal += itemSub;
      taxTotal += tax;
    });
    return { subtotal, taxTotal, grandTotal: Math.round(subtotal + taxTotal + (form.shipping || 0)) };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await createInvoice(form as any);
    setShowForm(false);
    setForm(emptyForm);
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this invoice?')) await deleteInvoice(id);
  };

  const handleMarkPaid = async (id: string) => {
    if (window.confirm('Mark this invoice as paid?')) await markPaid({ id });
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Invoice</title><style>
      body{font-family:Arial,sans-serif;margin:0;padding:30px;color:#333;font-size:13px}
      table{width:100%;border-collapse:collapse}
      th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e5e7eb}
      th{background:#f9fafb;font-weight:600;font-size:11px;color:#6b7280;text-transform:uppercase}
      .right{text-align:right}.bold{font-weight:700}.center{text-align:center}
      .logo-text{font-size:22px;font-weight:800;color:#D97706;letter-spacing:1px}
      .logo-icon{display:inline-flex;width:40px;height:40px;background:linear-gradient(135deg,#D97706,#EA580C);border-radius:10px;align-items:center;justify-content:center;margin-right:12px;vertical-align:middle}
      .logo-icon svg{width:22px;height:22px;fill:none;stroke:white;stroke-width:2}
      @media print{body{padding:15px}}
    </style></head><body>${printRef.current.innerHTML}<script>window.print();window.close()<\/script></body></html>`);
    win.document.close();
  };

  const InputError = ({ error }: { error?: string }) => error ? <p className="text-[10px] text-red-500 mt-0.5">{error}</p> : null;
  const totals = calcTotals();

  const LogoHTML = () => (
    <span>
      <span style={{ display: 'inline-flex', width: '40px', height: '40px', background: 'linear-gradient(135deg, #D97706, #EA580C)', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', marginRight: '12px', verticalAlign: 'middle' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </span>
      <span style={{ fontSize: '22px', fontWeight: 800, color: '#D97706', letterSpacing: '1px', verticalAlign: 'middle' }}>LuxeHome</span>
    </span>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage invoices</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setErrors({}); setShowForm(true); }} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600">
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No invoices yet.</p></div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-medium">Invoice #</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Payment</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3"><div className="font-medium">{inv.buyerName}</div><div className="text-xs text-gray-500">{inv.buyerEmail}</div></td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(inv.grandTotal)}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[inv.status]}`}>{inv.status}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentColors[inv.paymentStatus]}`}>{inv.paymentStatus}</span></td>
                  <td className="px-4 py-3 text-gray-500">{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreviewInvoice(inv)} className="p-1.5 hover:bg-gray-100 rounded" title="Preview"><Eye className="w-4 h-4" /></button>
                      {inv.paymentStatus !== 'paid' && <button onClick={() => handleMarkPaid(inv._id)} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Mark Paid"><CheckCircle className="w-4 h-4" /></button>}
                      <button onClick={() => handleDelete(inv._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">Create Invoice</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Logo Upload */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <input type="file" ref={logoInputRef} accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
                {form.sellerLogo ? (
                  <div className="flex items-center gap-3">
                    <img src={form.sellerLogo} alt="Logo" className="h-12 rounded-lg border" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, sellerLogo: '' }))} className="text-xs text-red-500 hover:underline">Remove</button>
                    <button type="button" onClick={() => logoInputRef.current?.click()} className="text-xs text-amber-600 hover:underline">Change</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo} className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-amber-500 hover:text-amber-600 transition-colors">
                    {uploadingLogo ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Company Logo</>}
                  </button>
                )}
                <span className="text-[10px] text-gray-400">PNG or JPG, max 2MB. Shows on invoice header.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Customer Details</h3>
                  <div className="space-y-2">
                    <div>
                      <input value={form.buyerName} onChange={e => { setForm(f => ({ ...f, buyerName: e.target.value })); clearFieldError('buyerName'); }} placeholder="Customer Name *" className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.buyerName ? 'border-red-400' : ''}`} />
                      <InputError error={errors.buyerName} />
                    </div>
                    <div>
                      <input value={form.buyerEmail} onChange={e => { setForm(f => ({ ...f, buyerEmail: e.target.value })); clearFieldError('buyerEmail'); }} placeholder="Email *" type="email" className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.buyerEmail ? 'border-red-400' : ''}`} />
                      <InputError error={errors.buyerEmail} />
                    </div>
                    <div>
                      <input value={form.buyerPhone} onChange={e => { const v = e.target.value.replace(/[^\d+\s-]/g, ''); setForm(f => ({ ...f, buyerPhone: v })); clearFieldError('buyerPhone'); }} onBlur={() => { if (form.buyerPhone.trim()) { let digits = form.buyerPhone.replace(/[^\d]/g, ''); if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2); if (digits.length !== 10) setErrors(prev => ({ ...prev, buyerPhone: 'Phone must be exactly 10 digits' })); } }} placeholder="Phone * (e.g. +91 98765 43210)" pattern="[0-9]{10}" maxLength={15} className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.buyerPhone ? 'border-red-400' : ''}`} />
                      <InputError error={errors.buyerPhone} />
                    </div>
                    <div>
                      <textarea value={form.buyerAddress} onChange={e => { setForm(f => ({ ...f, buyerAddress: e.target.value })); clearFieldError('buyerAddress'); }} placeholder="Full Address *" rows={2} className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.buyerAddress ? 'border-red-400' : ''}`} />
                      <InputError error={errors.buyerAddress} />
                    </div>
                    <div>
                      <input value={form.buyerGstin} onChange={e => { setForm(f => ({ ...f, buyerGstin: e.target.value.toUpperCase() })); clearFieldError('buyerGstin'); }} placeholder="GSTIN (e.g. 22AAAAA0000A1Z5)" maxLength={15} className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.buyerGstin ? 'border-red-400' : ''}`} />
                      <InputError error={errors.buyerGstin} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Invoice Settings</h3>
                  <div className="space-y-2">
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="standard">Standard Invoice</option><option value="proforma">Proforma Invoice</option><option value="credit_note">Credit Note</option>
                    </select>
                    <div>
                      <label className="text-[10px] text-gray-500">Due Date</label>
                      <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <input value={form.placeOfSupply} onChange={e => setForm(f => ({ ...f, placeOfSupply: e.target.value }))} placeholder="Place of Supply" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <div>
                      <input type="number" value={form.shipping} onChange={e => { setForm(f => ({ ...f, shipping: Number(e.target.value) })); clearFieldError('shipping'); }} placeholder="Shipping Cost" min="0" className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.shipping ? 'border-red-400' : ''}`} />
                      <InputError error={errors.shipping} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Items {errors.items && <span className="text-red-500 font-normal text-xs ml-2">{errors.items}</span>}</h3>
                  <div className="flex items-center gap-2">
                    <select onChange={e => { if (e.target.value) { const p = SERVICE_PRESETS.find(s => s.name === e.target.value); if (p) addPresetItem(p); e.target.value = ''; } }} className="text-xs px-2 py-1 border rounded-lg text-gray-500">
                      <option value="">Quick Add Service...</option>
                      {SERVICE_PRESETS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                    <button type="button" onClick={addItem} className="text-xs text-amber-600 font-medium">+ Custom Item</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-4">
                        <label className="text-[10px] text-gray-500">Item Name *</label>
                        <input value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="Product/Service" className={`w-full px-2 py-1.5 border rounded text-sm ${errors[`item_${idx}_name`] ? 'border-red-400' : ''}`} />
                        <InputError error={errors[`item_${idx}_name`]} />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">HSN</label>
                        <input value={item.hsnCode} onChange={e => updateItem(idx, 'hsnCode', e.target.value)} placeholder="HSN" className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Qty *</label>
                        <input type="number" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Math.max(1, Number(e.target.value)))} min="1" className={`w-full px-2 py-1.5 border rounded text-sm ${errors[`item_${idx}_quantity`] ? 'border-red-400' : ''}`} />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500">Unit Price *</label>
                        <input type="number" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Math.max(0, Number(e.target.value)))} min="0" step="0.01" className={`w-full px-2 py-1.5 border rounded text-sm ${errors[`item_${idx}_unitPrice`] ? 'border-red-400' : ''}`} />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Disc %</label>
                        <input type="number" value={item.discount} onChange={e => updateItem(idx, 'discount', Math.min(100, Math.max(0, Number(e.target.value))))} min="0" max="100" className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Tax %</label>
                        <input type="number" value={item.taxRate} onChange={e => updateItem(idx, 'taxRate', Math.min(28, Math.max(0, Number(e.target.value))))} min="0" max="28" className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Total</label>
                        <div className="px-2 py-1.5 text-sm font-medium">{formatCurrency(item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100) * (1 + (item.taxRate || 18) / 100))}</div>
                      </div>
                      <div className="col-span-1">{form.items.length > 1 && <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X className="w-3.5 h-3.5" /></button>}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Additional notes for the customer..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Terms & Conditions</label>
                  <textarea value={form.termsAndConditions} onChange={e => setForm(f => ({ ...f, termsAndConditions: e.target.value }))} rows={5} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>

              <div className="flex justify-between items-start border-t pt-4">
                <div />
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span className="font-medium">{formatCurrency(totals.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax:</span><span className="font-medium">{formatCurrency(totals.taxTotal)}</span></div>
                  {form.shipping > 0 && <div className="flex justify-between"><span className="text-gray-500">Shipping:</span><span className="font-medium">{formatCurrency(form.shipping)}</span></div>}
                  <div className="flex justify-between border-t pt-1 mt-1"><span className="font-semibold">Grand Total:</span><span className="font-bold text-lg">{formatCurrency(totals.grandTotal)}</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={creating} className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm disabled:opacity-50">
                  <Save className="w-4 h-4" /> Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Invoice Preview</h2>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"><Printer className="w-4 h-4" /> Print / PDF</button>
                <button onClick={() => setPreviewInvoice(null)}><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div ref={printRef} style={{ padding: '40px', fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#333' }}>
              {/* Header with Logo */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '3px solid #D97706', paddingBottom: '20px' }}>
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    {previewInvoice.sellerLogo && previewInvoice.sellerLogo.length > 0 ? (
                      <img src={previewInvoice.sellerLogo} alt="Company Logo" style={{ height: '50px', marginBottom: '5px' }} />
                    ) : (
                      <>
                        <span style={{ display: 'inline-flex', width: '40px', height: '40px', background: 'linear-gradient(135deg, #D97706, #EA580C)', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', marginRight: '12px', verticalAlign: 'middle' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        </span>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', letterSpacing: '1px', verticalAlign: 'middle' }}>LuxeHome</span>
                      </>
                    )}
                  </div>
                  <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.sellerName}</p>
                  <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.sellerAddress}</p>
                  <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.sellerPhone} | {previewInvoice.sellerEmail}</p>
                  {previewInvoice.sellerGstin && <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>GSTIN: {previewInvoice.sellerGstin}</p>}
                  {previewInvoice.sellerPan && <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>PAN: {previewInvoice.sellerPan}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', margin: '0', letterSpacing: '2px' }}>
                    {previewInvoice.type === 'proforma' ? 'PROFORMA' : previewInvoice.type === 'credit_note' ? 'CREDIT NOTE' : 'TAX INVOICE'}
                  </h2>
                  <p style={{ margin: '8px 0 3px', fontSize: '15px', fontWeight: 700 }}>#{previewInvoice.invoiceNumber}</p>
                  <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>Date: {new Date(previewInvoice.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  {previewInvoice.dueDate && <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>Due: {new Date(previewInvoice.dueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                  {previewInvoice.placeOfSupply && <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>Place of Supply: {previewInvoice.placeOfSupply}</p>}
                  <p style={{ margin: '8px 0 0' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: previewInvoice.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7', color: previewInvoice.paymentStatus === 'paid' ? '#16a34a' : '#d97706' }}>
                      {previewInvoice.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div style={{ background: '#f9fafb', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px', borderLeft: '4px solid #D97706' }}>
                <p style={{ fontSize: '10px', color: '#999', fontWeight: 700, marginBottom: '6px', letterSpacing: '1px' }}>BILL TO</p>
                <p style={{ fontWeight: 700, margin: '0', fontSize: '15px' }}>{previewInvoice.buyerName}</p>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.buyerAddress}</p>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.buyerPhone} | {previewInvoice.buyerEmail}</p>
                {previewInvoice.buyerGstin && <p style={{ margin: '3px 0', fontSize: '12px', color: '#666', fontWeight: 600 }}>GSTIN: {previewInvoice.buyerGstin}</p>}
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead><tr style={{ background: '#D97706', color: 'white' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600 }}>ITEM DESCRIPTION</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', fontWeight: 600 }}>HSN</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600 }}>QTY</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600 }}>RATE</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600 }}>TAX</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600 }}>AMOUNT</th>
                </tr></thead>
                <tbody>
                  {previewInvoice.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: '#666' }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px' }}><span style={{ fontWeight: 600 }}>{item.name}</span>{item.description && <><br /><span style={{ color: '#999', fontSize: '11px' }}>{item.description}</span></>}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: '#666', textAlign: 'center' }}>{item.hsnCode || '-'}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right' }}>{item.quantity}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right' }}>{item.taxRate}%</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{ width: '300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}><span style={{ color: '#666' }}>Subtotal</span><span>{formatCurrency(previewInvoice.subtotal)}</span></div>
                  {previewInvoice.discountTotal > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}><span style={{ color: '#666' }}>Discount</span><span style={{ color: '#16a34a' }}>-{formatCurrency(previewInvoice.discountTotal)}</span></div>}
                  {previewInvoice.cgst > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}><span style={{ color: '#666' }}>CGST</span><span>{formatCurrency(previewInvoice.cgst)}</span></div>}
                  {previewInvoice.sgst > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}><span style={{ color: '#666' }}>SGST</span><span>{formatCurrency(previewInvoice.sgst)}</span></div>}
                  {previewInvoice.igst > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}><span style={{ color: '#666' }}>IGST</span><span>{formatCurrency(previewInvoice.igst)}</span></div>}
                  {previewInvoice.shipping > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}><span style={{ color: '#666' }}>Shipping</span><span>{formatCurrency(previewInvoice.shipping)}</span></div>}
                  {previewInvoice.roundOff !== 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}><span style={{ color: '#666' }}>Round Off</span><span>{formatCurrency(previewInvoice.roundOff)}</span></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '18px', fontWeight: 800, borderTop: '3px solid #D97706', marginTop: '8px' }}>
                    <span>Grand Total</span><span style={{ color: '#D97706' }}>{formatCurrency(previewInvoice.grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', border: '1px solid #fde68a' }}>
                <strong>Amount in Words:</strong> {previewInvoice.amountInWords}
              </div>

              {(previewInvoice.notes || previewInvoice.termsAndConditions) && (
                <div style={{ display: 'flex', gap: '30px', fontSize: '11px', color: '#888', marginBottom: '30px' }}>
                  {previewInvoice.notes && <div style={{ flex: 1 }}><strong style={{ color: '#555', display: 'block', marginBottom: '4px' }}>Notes:</strong>{previewInvoice.notes}</div>}
                  {previewInvoice.termsAndConditions && <div style={{ flex: 1 }}><strong style={{ color: '#555', display: 'block', marginBottom: '4px' }}>Terms & Conditions:</strong><span style={{ whiteSpace: 'pre-line' }}>{previewInvoice.termsAndConditions}</span></div>}
                </div>
              )}

              {/* Signature */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #ccc', height: '50px', marginBottom: '5px' }} />
                  <p style={{ fontSize: '11px', color: '#666', margin: '0' }}>Authorized Signatory</p>
                  <p style={{ fontSize: '10px', color: '#999', margin: '2px 0 0' }}>{previewInvoice.sellerName}</p>
                </div>
              </div>

              <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px', textAlign: 'center', fontSize: '10px', color: '#999' }}>
                This is a computer generated invoice and does not require a physical signature. | {previewInvoice.sellerName} | {previewInvoice.sellerPhone}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
