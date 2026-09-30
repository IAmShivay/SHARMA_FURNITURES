import React, { useState, useRef } from 'react';
import { Plus, Eye, Trash2, Search, X, Save, Printer, CheckCircle, Clock, AlertCircle, CreditCard, FileText } from 'lucide-react';
import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useMarkPaidMutation,
  Invoice,
} from '../../../store/api/invoiceApi';
import { formatCurrency } from '../../../utils/formatters';

const SELLER_DEFAULTS = {
  sellerName: 'LuxeHome - Sharma Furnitures',
  sellerAddress: 'Arrah Shree Pally, Durgapur, West Bengal 713212',
  sellerPhone: '+91 8918349445',
  sellerEmail: 'hello@formiqstudio.in',
  sellerGstin: '',
  sellerPan: '',
  sellerLogo: '',
};

const emptyItem = { name: '', description: '', hsnCode: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 18, taxAmount: 0, total: 0 };

const emptyForm = {
  ...SELLER_DEFAULTS,
  type: 'standard' as const,
  buyerName: '', buyerAddress: '', buyerPhone: '', buyerEmail: '', buyerGstin: '',
  items: [{ ...emptyItem }],
  shipping: 0,
  notes: '',
  termsAndConditions: 'Payment is due within 15 days. Late payments may incur additional charges.',
  placeOfSupply: 'West Bengal',
  dueDate: '',
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-orange-100 text-orange-700',
  refunded: 'bg-red-100 text-red-700',
};

const InvoiceManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetInvoicesQuery({ search, status: statusFilter || undefined });
  const [createInvoice, { isLoading: creating }] = useCreateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [markPaid] = useMarkPaidMutation();

  const invoices = data?.data?.invoices || [];

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...emptyItem }] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx: number, field: string, value: any) => {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, items };
    });
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
    const grandTotal = Math.round(subtotal + taxTotal + (form.shipping || 0));
    return { subtotal, taxTotal, grandTotal };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInvoice(form as any);
    setShowForm(false);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this invoice?')) await deleteInvoice(id);
  };

  const handleMarkPaid = async (id: string) => {
    if (window.confirm('Mark this invoice as paid?')) await markPaid({ id });
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Invoice</title>
      <style>
        body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#333}
        table{width:100%;border-collapse:collapse}
        th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #eee}
        th{background:#f8f8f8;font-weight:600}
        .text-right{text-align:right}
        .text-center{text-align:center}
        .bold{font-weight:700}
        .header{display:flex;justify-content:space-between;margin-bottom:30px}
        .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600}
        .paid{background:#dcfce7;color:#16a34a}
        .pending{background:#fef3c7;color:#d97706}
        @media print{body{padding:0}}
      </style></head><body>
      ${printRef.current.innerHTML}
      <script>window.print();window.close()<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const totals = calcTotals();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage invoices</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowForm(true); }} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600">
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
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No invoices yet.</p>
        </div>
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
                  <td className="px-4 py-3">
                    <div className="font-medium">{inv.buyerName}</div>
                    <div className="text-xs text-gray-500">{inv.buyerEmail}</div>
                  </td>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Customer Details</h3>
                  <div className="space-y-2">
                    <input value={form.buyerName} onChange={e => setForm(f => ({ ...f, buyerName: e.target.value }))} placeholder="Customer Name *" required className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input value={form.buyerEmail} onChange={e => setForm(f => ({ ...f, buyerEmail: e.target.value }))} placeholder="Email *" required type="email" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input value={form.buyerPhone} onChange={e => setForm(f => ({ ...f, buyerPhone: e.target.value }))} placeholder="Phone *" required className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <textarea value={form.buyerAddress} onChange={e => setForm(f => ({ ...f, buyerAddress: e.target.value }))} placeholder="Address *" required rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input value={form.buyerGstin} onChange={e => setForm(f => ({ ...f, buyerGstin: e.target.value }))} placeholder="GSTIN (optional)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Invoice Settings</h3>
                  <div className="space-y-2">
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="standard">Standard Invoice</option>
                      <option value="proforma">Proforma Invoice</option>
                      <option value="credit_note">Credit Note</option>
                    </select>
                    <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input value={form.placeOfSupply} onChange={e => setForm(f => ({ ...f, placeOfSupply: e.target.value }))} placeholder="Place of Supply" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" value={form.shipping} onChange={e => setForm(f => ({ ...f, shipping: Number(e.target.value) }))} placeholder="Shipping Cost" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Items</h3>
                  <button type="button" onClick={addItem} className="text-xs text-amber-600 font-medium">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-4">
                        <label className="text-[10px] text-gray-500">Item Name</label>
                        <input value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="Product/Service" required className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">HSN</label>
                        <input value={item.hsnCode} onChange={e => updateItem(idx, 'hsnCode', e.target.value)} placeholder="HSN" className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Qty</label>
                        <input type="number" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} min="1" className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500">Unit Price</label>
                        <input type="number" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} min="0" className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Disc %</label>
                        <input type="number" value={item.discount} onChange={e => updateItem(idx, 'discount', Number(e.target.value))} min="0" max="100" className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Tax %</label>
                        <input type="number" value={item.taxRate} onChange={e => updateItem(idx, 'taxRate', Number(e.target.value))} className="w-full px-2 py-1.5 border rounded text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] text-gray-500">Total</label>
                        <div className="px-2 py-1.5 text-sm font-medium">{formatCurrency(item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100) * (1 + (item.taxRate || 18) / 100))}</div>
                      </div>
                      <div className="col-span-1">
                        {form.items.length > 1 && <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X className="w-3.5 h-3.5" /></button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex-1 mr-6">
                  <label className="text-sm font-medium mb-1 block">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Additional notes..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span className="font-medium">{formatCurrency(totals.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax:</span><span className="font-medium">{formatCurrency(totals.taxTotal)}</span></div>
                  {form.shipping > 0 && <div className="flex justify-between"><span className="text-gray-500">Shipping:</span><span className="font-medium">{formatCurrency(form.shipping)}</span></div>}
                  <div className="flex justify-between border-t pt-1 mt-1"><span className="font-semibold">Grand Total:</span><span className="font-bold text-lg">{formatCurrency(totals.grandTotal)}</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={creating} className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm disabled:opacity-50">
                  <Save className="w-4 h-4" /> Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Invoice Preview</h2>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">
                  <Printer className="w-4 h-4" /> Print / PDF
                </button>
                <button onClick={() => setPreviewInvoice(null)}><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div ref={printRef} className="p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
              {/* Invoice Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                  {previewInvoice.sellerLogo && <img src={previewInvoice.sellerLogo} alt="Logo" style={{ height: '50px', marginBottom: '10px' }} />}
                  <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#D97706', margin: '0 0 5px 0' }}>{previewInvoice.sellerName}</h1>
                  <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.sellerAddress}</p>
                  <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.sellerPhone} | {previewInvoice.sellerEmail}</p>
                  {previewInvoice.sellerGstin && <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>GSTIN: {previewInvoice.sellerGstin}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#333', margin: '0' }}>
                    {previewInvoice.type === 'proforma' ? 'PROFORMA' : previewInvoice.type === 'credit_note' ? 'CREDIT NOTE' : 'INVOICE'}
                  </h2>
                  <p style={{ margin: '5px 0 2px', fontSize: '14px', fontWeight: '600' }}>#{previewInvoice.invoiceNumber}</p>
                  <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>Date: {new Date(previewInvoice.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  {previewInvoice.dueDate && <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>Due: {new Date(previewInvoice.dueDate).toLocaleDateString('en-IN')}</p>}
                  <p style={{ margin: '5px 0' }}>
                    <span className={`badge ${previewInvoice.paymentStatus === 'paid' ? 'paid' : 'pending'}`} style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: previewInvoice.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7', color: previewInvoice.paymentStatus === 'paid' ? '#16a34a' : '#d97706' }}>
                      {previewInvoice.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
                <p style={{ fontSize: '11px', color: '#999', fontWeight: '600', marginBottom: '5px' }}>BILL TO</p>
                <p style={{ fontWeight: '600', margin: '0' }}>{previewInvoice.buyerName}</p>
                <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.buyerAddress}</p>
                <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>{previewInvoice.buyerPhone} | {previewInvoice.buyerEmail}</p>
                {previewInvoice.buyerGstin && <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>GSTIN: {previewInvoice.buyerGstin}</p>}
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>#</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>Item</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>HSN</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Qty</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Rate</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Tax</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {previewInvoice.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px 12px', fontSize: '12px' }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', fontWeight: '500' }}>{item.name}{item.description && <><br /><span style={{ color: '#999', fontSize: '11px' }}>{item.description}</span></>}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: '#666' }}>{item.hsnCode || '-'}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right' }}>{item.quantity}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right' }}>{item.taxRate}%</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{ width: '280px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span style={{ color: '#666' }}>Subtotal</span><span>{formatCurrency(previewInvoice.subtotal)}</span>
                  </div>
                  {previewInvoice.discountTotal > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span style={{ color: '#666' }}>Discount</span><span>-{formatCurrency(previewInvoice.discountTotal)}</span>
                  </div>}
                  {previewInvoice.cgst > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span style={{ color: '#666' }}>CGST</span><span>{formatCurrency(previewInvoice.cgst)}</span>
                  </div>}
                  {previewInvoice.sgst > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span style={{ color: '#666' }}>SGST</span><span>{formatCurrency(previewInvoice.sgst)}</span>
                  </div>}
                  {previewInvoice.igst > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span style={{ color: '#666' }}>IGST</span><span>{formatCurrency(previewInvoice.igst)}</span>
                  </div>}
                  {previewInvoice.shipping > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span style={{ color: '#666' }}>Shipping</span><span>{formatCurrency(previewInvoice.shipping)}</span>
                  </div>}
                  {previewInvoice.roundOff !== 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span style={{ color: '#666' }}>Round Off</span><span>{formatCurrency(previewInvoice.roundOff)}</span>
                  </div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '16px', fontWeight: '700', borderTop: '2px solid #333', marginTop: '5px' }}>
                    <span>Grand Total</span><span>{formatCurrency(previewInvoice.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Amount in Words */}
              <div style={{ background: '#fffbeb', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', fontSize: '12px' }}>
                <strong>Amount in Words:</strong> {previewInvoice.amountInWords}
              </div>

              {/* Notes & Terms */}
              <div style={{ display: 'flex', gap: '30px', fontSize: '11px', color: '#888', marginBottom: '30px' }}>
                {previewInvoice.notes && <div style={{ flex: 1 }}><strong style={{ color: '#666' }}>Notes:</strong><br />{previewInvoice.notes}</div>}
                {previewInvoice.termsAndConditions && <div style={{ flex: 1 }}><strong style={{ color: '#666' }}>Terms & Conditions:</strong><br />{previewInvoice.termsAndConditions}</div>}
              </div>

              {/* Footer */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center', fontSize: '11px', color: '#999' }}>
                This is a computer generated invoice. | {previewInvoice.sellerName} | {previewInvoice.sellerPhone}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
