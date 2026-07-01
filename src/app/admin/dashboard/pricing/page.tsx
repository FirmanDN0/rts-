'use client';

import { useState, useEffect } from 'react';
import {
  Coins,
  Settings,
  Users,
  MapPin,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Check,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { formatIDR } from '@/lib/calculator';

type ActiveSubTab = 'equipment' | 'labor' | 'options' | 'categories' | 'variable' | 'assets' | 'option' | 'category' | 'asset';

export default function PricingDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>('equipment');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States for database tables
  const [equipment, setEquipment] = useState<any[]>([]);
  const [labor, setLabor] = useState<any[]>([]);
  const [scoreOptions, setScoreOptions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [variableCosts, setVariableCosts] = useState<any[]>([]);
  const [assetPrices, setAssetPrices] = useState<any[]>([]);

  // Editing / Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New item states
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    category: 'Kamera',
    provider: '',
    purchasePrice: '',
    targetBep: '',
    pricePerHour: '',
  });

  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Desain Grafis',
    priceMin: '',
    priceMax: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pricing');
      if (res.ok) {
        const data = await res.json();
        setEquipment(data.equipment || []);
        setLabor(data.labor || []);
        setScoreOptions(data.scoreOptions || []);
        setCategories(data.categories || []);
        setVariableCosts(data.variableCosts || []);
        setAssetPrices(data.assetPrices || []);
      } else {
        setErrorMsg('Gagal memuat master data pricing.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Koneksi terputus. Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerAlert = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleUpdate = async (type: ActiveSubTab, item: any) => {
    setSaving(true);
    let apiType: string = type;
    if (type === 'options') apiType = 'option';
    if (type === 'categories') apiType = 'category';
    if (type === 'assets') apiType = 'asset';

    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: apiType,
          action: 'update',
          data: item,
        }),
      });
      if (res.ok) {
        triggerAlert('Data berhasil diperbarui!');
        setEditingItem(null);
        await loadData();
      } else {
        const d = await res.json();
        triggerAlert(d.error || 'Gagal menyimpan data.', true);
      }
    } catch (err) {
      triggerAlert('Terjadi kesalahan koneksi.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (type: 'equipment' | 'asset', data: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          action: 'create',
          data,
        }),
      });
      if (res.ok) {
        triggerAlert('Data baru berhasil dibuat!');
        setShowAddForm(false);
        // Reset forms
        setNewEquipment({ name: '', category: 'Kamera', provider: '', purchasePrice: '', targetBep: '', pricePerHour: '' });
        setNewAsset({ name: '', category: 'Desain Grafis', priceMin: '', priceMax: '' });
        await loadData();
      } else {
        const d = await res.json();
        triggerAlert(d.error || 'Gagal membuat data baru.', true);
      }
    } catch (err) {
      triggerAlert('Terjadi kesalahan koneksi.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: 'equipment' | 'labor' | 'asset', id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          action: 'delete',
          data: { id },
        }),
      });
      if (res.ok) {
        triggerAlert('Data berhasil dihapus.');
        await loadData();
      } else {
        triggerAlert('Gagal menghapus data.', true);
      }
    } catch (err) {
      triggerAlert('Terjadi kesalahan koneksi.', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Coins className="w-8 h-8 text-[#2F3A8F]" />
            <span>Master Pricing & Cost Structure</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola parameter perhitungan biaya real-time untuk RTS Smart Pricing System berdasarkan file Cost Structure.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Alert Notifications */}
      {successMsg && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center space-x-3 text-xs">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center space-x-3 text-xs">
          <X className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm max-w-fit">
        {[
          { id: 'equipment', label: 'Fixed Costs (Alat)', icon: Settings },
          { id: 'labor', label: 'Labor (Kru Jasa)', icon: Users },
          { id: 'options', label: 'Score Options', icon: Sliders },
          { id: 'categories', label: 'Project Scale & Profit', icon: DollarSign },
          { id: 'variable', label: 'Variable (Akomodasi)', icon: MapPin },
          { id: 'assets', label: 'Content Assets (CA)', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ActiveSubTab);
                setEditingItem(null);
                setShowAddForm(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#2F3A8F] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Tabs */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-[#2F3A8F] mx-auto" />
          <p className="text-slate-400 text-xs font-light">Sedang memuat data pricing...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
          
          {/* TAB 1: EQUIPMENT */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Daftar Peralatan & Fixed Cost</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Biaya sewa alat per jam dihitung dengan rumus: Harga Beli / Target BEP.</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[#2F3A8F] hover:bg-[#1E255C] text-white font-bold text-xs tracking-wider px-4 py-2.5 rounded flex items-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Alat</span>
                </button>
              </div>

              {/* Add form */}
              {showAddForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Nama Alat</label>
                    <input
                      type="text"
                      value={newEquipment.name}
                      onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                      placeholder="Sony FX3"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Kategori</label>
                    <select
                      value={newEquipment.category}
                      onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    >
                      <option value="Kamera">Kamera</option>
                      <option value="Mic">Mic</option>
                      <option value="Gimbal">Gimbal</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Drone">Drone</option>
                      <option value="Tripod">Tripod</option>
                      <option value="Reflektor">Reflektor</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Pemilik / Provider</label>
                    <input
                      type="text"
                      value={newEquipment.provider}
                      onChange={(e) => setNewEquipment({ ...newEquipment, provider: e.target.value })}
                      placeholder="Favian"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Harga Beli (Rp)</label>
                    <input
                      type="number"
                      value={newEquipment.purchasePrice}
                      onChange={(e) => setNewEquipment({ ...newEquipment, purchasePrice: e.target.value })}
                      placeholder="13000000"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Target BEP (Jam)</label>
                    <input
                      type="number"
                      value={newEquipment.targetBep}
                      onChange={(e) => setNewEquipment({ ...newEquipment, targetBep: e.target.value })}
                      placeholder="450"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Harga per Jam (Rp)</label>
                    <input
                      type="number"
                      value={newEquipment.pricePerHour}
                      onChange={(e) => setNewEquipment({ ...newEquipment, pricePerHour: e.target.value })}
                      placeholder="28889"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 md:col-span-3 flex justify-end space-x-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-white border border-gray-200 text-slate-500 font-semibold px-4 py-2 rounded text-xs"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleCreate('equipment', newEquipment)}
                      disabled={saving}
                      className="bg-[#2F3A8F] text-white font-bold px-4 py-2 rounded text-xs"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan Alat'}
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-650">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="p-4 border-b border-gray-200">Nama Alat</th>
                      <th className="p-4 border-b border-gray-200">Kategori</th>
                      <th className="p-4 border-b border-gray-200">Provider</th>
                      <th className="p-4 border-b border-gray-200">Harga Beli</th>
                      <th className="p-4 border-b border-gray-200">BEP Target</th>
                      <th className="p-4 border-b border-gray-200">Harga/Jam</th>
                      <th className="p-4 border-b border-gray-200 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {equipment.map((eq) => {
                      const isEditing = editingItem?.id === eq.id && editingItem?.type === 'equipment';
                      return (
                        <tr key={eq.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs"
                              />
                            ) : (
                              <span className="font-semibold text-slate-800">{eq.name}</span>
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-24"
                              />
                            ) : (
                              eq.category
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingItem.provider}
                                onChange={(e) => setEditingItem({ ...editingItem, provider: e.target.value })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-24"
                              />
                            ) : (
                              eq.provider
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.purchasePrice}
                                onChange={(e) => setEditingItem({ ...editingItem, purchasePrice: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-28"
                              />
                            ) : (
                              formatIDR(eq.purchasePrice)
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.targetBep}
                                onChange={(e) => setEditingItem({ ...editingItem, targetBep: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-16"
                              />
                            ) : (
                              `${eq.targetBep} jam`
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-800">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.pricePerHour}
                                onChange={(e) => setEditingItem({ ...editingItem, pricePerHour: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-24 font-bold"
                              />
                            ) : (
                              formatIDR(eq.pricePerHour)
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => handleUpdate('equipment', editingItem)}
                                  className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-gray-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => setEditingItem({ ...eq, type: 'equipment' })}
                                  className="text-[#2F3A8F] hover:text-[#1E255C] p-1.5 hover:bg-blue-50 rounded"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete('equipment', eq.id)}
                                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LABOR */}
          {activeTab === 'labor' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Tarif Crew Jasa (Labor Cost)</h3>
                <p className="text-slate-400 text-xs mt-0.5">Tarif gaji internal dan harga jasa yang dibebankan kepada client (+20%).</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-650">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="p-4 border-b border-gray-200">Peran / Role</th>
                      <th className="p-4 border-b border-gray-200">Gaji Ringan</th>
                      <th className="p-4 border-b border-gray-200">Tarif Client Ringan</th>
                      <th className="p-4 border-b border-gray-200">Gaji Menengah</th>
                      <th className="p-4 border-b border-gray-200">Tarif Client Menengah</th>
                      <th className="p-4 border-b border-gray-200">Gaji Besar</th>
                      <th className="p-4 border-b border-gray-200">Tarif Client Besar</th>
                      <th className="p-4 border-b border-gray-200 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {labor.map((lab) => {
                      const isEditing = editingItem?.id === lab.id && editingItem?.type === 'labor';
                      return (
                        <tr key={lab.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-semibold text-slate-800">{lab.role}</td>
                          
                          {/* Ringan */}
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.priceRingan}
                                onChange={(e) => setEditingItem({
                                  ...editingItem,
                                  priceRingan: Number(e.target.value),
                                  chargeRingan: Math.round(Number(e.target.value) * 1.2)
                                })}
                                className="border border-gray-200 rounded px-1.5 py-1 text-xs w-20"
                              />
                            ) : (
                              formatIDR(lab.priceRingan)
                            )}
                          </td>
                          <td className="p-4 font-semibold text-[#2F3A8F]">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.chargeRingan}
                                onChange={(e) => setEditingItem({ ...editingItem, chargeRingan: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-1.5 py-1 text-xs w-20 text-[#2F3A8F] font-semibold"
                              />
                            ) : (
                              formatIDR(lab.chargeRingan)
                            )}
                          </td>

                          {/* Menengah */}
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.priceMenengah}
                                onChange={(e) => setEditingItem({
                                  ...editingItem,
                                  priceMenengah: Number(e.target.value),
                                  chargeMenengah: Math.round(Number(e.target.value) * 1.2)
                                })}
                                className="border border-gray-200 rounded px-1.5 py-1 text-xs w-20"
                              />
                            ) : (
                              formatIDR(lab.priceMenengah)
                            )}
                          </td>
                          <td className="p-4 font-semibold text-[#2F3A8F]">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.chargeMenengah}
                                onChange={(e) => setEditingItem({ ...editingItem, chargeMenengah: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-1.5 py-1 text-xs w-20 text-[#2F3A8F] font-semibold"
                              />
                            ) : (
                              formatIDR(lab.chargeMenengah)
                            )}
                          </td>

                          {/* Besar */}
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.priceBesar}
                                onChange={(e) => setEditingItem({
                                  ...editingItem,
                                  priceBesar: Number(e.target.value),
                                  chargeBesar: Math.round(Number(e.target.value) * 1.2)
                                })}
                                className="border border-gray-200 rounded px-1.5 py-1 text-xs w-20"
                              />
                            ) : (
                              formatIDR(lab.priceBesar)
                            )}
                          </td>
                          <td className="p-4 font-semibold text-[#2F3A8F]">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.chargeBesar}
                                onChange={(e) => setEditingItem({ ...editingItem, chargeBesar: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-1.5 py-1 text-xs w-20 text-[#2F3A8F] font-semibold"
                              />
                            ) : (
                              formatIDR(lab.chargeBesar)
                            )}
                          </td>

                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => handleUpdate('labor', editingItem)}
                                  className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-gray-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingItem({ ...lab, type: 'labor' })}
                                className="text-[#2F3A8F] hover:text-[#1E255C] p-1.5 hover:bg-blue-50 rounded"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SCORE OPTIONS */}
          {activeTab === 'options' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Scoring Parameter Poin</h3>
                <p className="text-slate-400 text-xs mt-0.5">Daftar opsi pilihan pertanyaan untuk menghitung bobot kerumitan proyek.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-650">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="p-4 border-b border-gray-200">Parameter Kategori</th>
                      <th className="p-4 border-b border-gray-200">Label Pilihan</th>
                      <th className="p-4 border-b border-gray-200">Nilai Bobot (Score)</th>
                      <th className="p-4 border-b border-gray-200 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {scoreOptions.map((opt) => {
                      const isEditing = editingItem?.id === opt.id && editingItem?.type === 'options';
                      return (
                        <tr key={opt.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-semibold text-slate-800">{opt.parameter}</td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingItem.optionLabel}
                                onChange={(e) => setEditingItem({ ...editingItem, optionLabel: e.target.value })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-48"
                              />
                            ) : (
                              opt.optionLabel
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-800">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.score}
                                onChange={(e) => setEditingItem({ ...editingItem, score: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-20 font-bold"
                              />
                            ) : (
                              `+${opt.score} Poin`
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => handleUpdate('option', editingItem)}
                                  className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-gray-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingItem({ ...opt, type: 'options' })}
                                className="text-[#2F3A8F] hover:text-[#1E255C] p-1.5 hover:bg-blue-50 rounded"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Kategori Proyek & Profit Margin</h3>
                <p className="text-slate-400 text-xs mt-0.5">Klasifikasi tingkat kompleksitas berdasarkan total score, harga per score, dan markup profit.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-650">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="p-4 border-b border-gray-200">Kategori Proyek</th>
                      <th className="p-4 border-b border-gray-200">Score Minimal</th>
                      <th className="p-4 border-b border-gray-200">Score Maksimal</th>
                      <th className="p-4 border-b border-gray-200">Harga Per Score (Development Fee)</th>
                      <th className="p-4 border-b border-gray-200">Profit Markup (%)</th>
                      <th className="p-4 border-b border-gray-200 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {categories.map((cat) => {
                      const isEditing = editingItem?.id === cat.id && editingItem?.type === 'categories';
                      return (
                        <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-semibold text-slate-800">{cat.category}</td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.minScore}
                                onChange={(e) => setEditingItem({ ...editingItem, minScore: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-20"
                              />
                            ) : (
                              cat.minScore
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.maxScore}
                                onChange={(e) => setEditingItem({ ...editingItem, maxScore: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-20"
                              />
                            ) : (
                              cat.maxScore
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-800">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.pricePerScore}
                                onChange={(e) => setEditingItem({ ...editingItem, pricePerScore: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-32 font-bold"
                              />
                            ) : (
                              `${formatIDR(cat.pricePerScore)} / score`
                            )}
                          </td>
                          <td className="p-4 font-bold text-[#2F3A8F]">
                            {isEditing ? (
                              <input
                                type="number"
                                step={0.01}
                                value={editingItem.profitPercentage}
                                onChange={(e) => setEditingItem({ ...editingItem, profitPercentage: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-24 text-[#2F3A8F] font-bold"
                              />
                            ) : (
                              `${Math.round(cat.profitPercentage * 100)}%`
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => handleUpdate('category', editingItem)}
                                  className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-gray-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingItem({ ...cat, type: 'categories' })}
                                className="text-[#2F3A8F] hover:text-[#1E255C] p-1.5 hover:bg-blue-50 rounded"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: VARIABLE COSTS */}
          {activeTab === 'variable' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Biaya Akomodasi & Transportasi</h3>
                <p className="text-slate-400 text-xs mt-0.5">Biaya variabel berdasarkan jangkauan lokasi produksi.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-650">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="p-4 border-b border-gray-200">Nama Variable Cost</th>
                      <th className="p-4 border-b border-gray-200">Tarif / Harga</th>
                      <th className="p-4 border-b border-gray-200 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {variableCosts.map((vc) => {
                      const isEditing = editingItem?.id === vc.id && editingItem?.type === 'variable';
                      return (
                        <tr key={vc.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-semibold text-slate-800">{vc.name}</td>
                          <td className="p-4 font-bold text-slate-800">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.price}
                                onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-32 font-bold"
                              />
                            ) : (
                              formatIDR(vc.price)
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => handleUpdate('variable', editingItem)}
                                  className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-gray-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingItem({ ...vc, type: 'variable' })}
                                className="text-[#2F3A8F] hover:text-[#1E255C] p-1.5 hover:bg-blue-50 rounded"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CONTENT ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Content Asset Pricing (CA)</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Daftar harga asset visual digital dengan range tarif minimum dan maksimum per asset.</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[#2F3A8F] hover:bg-[#1E255C] text-white font-bold text-xs tracking-wider px-4 py-2.5 rounded flex items-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Asset</span>
                </button>
              </div>

              {/* Add form */}
              {showAddForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Nama Asset</label>
                    <input
                      type="text"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                      placeholder="Media Sosial Feed Promosi"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Kategori</label>
                    <select
                      value={newAsset.category}
                      onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    >
                      <option value="Desain Grafis">Desain Grafis</option>
                      <option value="Editing Video">Editing Video</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Harga Minimal (Rp)</label>
                    <input
                      type="number"
                      value={newAsset.priceMin}
                      onChange={(e) => setNewAsset({ ...newAsset, priceMin: e.target.value })}
                      placeholder="3500"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Harga Maksimal (Rp)</label>
                    <input
                      type="number"
                      value={newAsset.priceMax}
                      onChange={(e) => setNewAsset({ ...newAsset, priceMax: e.target.value })}
                      placeholder="32000"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 md:col-span-4 flex justify-end space-x-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-white border border-gray-200 text-slate-500 font-semibold px-4 py-2 rounded text-xs"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleCreate('asset', newAsset)}
                      disabled={saving}
                      className="bg-[#2F3A8F] text-white font-bold px-4 py-2 rounded text-xs"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan Asset'}
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-650">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="p-4 border-b border-gray-200">Nama Asset</th>
                      <th className="p-4 border-b border-gray-200">Kategori</th>
                      <th className="p-4 border-b border-gray-200">Harga Minimal</th>
                      <th className="p-4 border-b border-gray-200">Harga Maksimal</th>
                      <th className="p-4 border-b border-gray-200 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {assetPrices.map((asset) => {
                      const isEditing = editingItem?.id === asset.id && editingItem?.type === 'assets';
                      return (
                        <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs"
                              />
                            ) : (
                              <span className="font-semibold text-slate-800">{asset.name}</span>
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-32"
                              />
                            ) : (
                              asset.category
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-800">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.priceMin}
                                onChange={(e) => setEditingItem({ ...editingItem, priceMin: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-28 font-bold"
                              />
                            ) : (
                              formatIDR(asset.priceMin)
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-800">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingItem.priceMax}
                                onChange={(e) => setEditingItem({ ...editingItem, priceMax: Number(e.target.value) })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-28 font-bold"
                              />
                            ) : (
                              formatIDR(asset.priceMax)
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => handleUpdate('asset', editingItem)}
                                  className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-gray-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => setEditingItem({ ...asset, type: 'assets' })}
                                  className="text-[#2F3A8F] hover:text-[#1E255C] p-1.5 hover:bg-blue-50 rounded"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete('asset', asset.id)}
                                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
