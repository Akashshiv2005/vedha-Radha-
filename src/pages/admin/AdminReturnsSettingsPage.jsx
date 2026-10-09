import React, { useState } from 'react';
import { 
  RotateCcw, 
  SlidersHorizontal, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  Gem, 
  Save, 
  Info, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  FileCheck,
  Building2,
  X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminReturnsSettingsPage() {
  const { 
    returns, 
    settings, 
    updateSettings, 
    processReturnInspection, 
    resetToDemoDefaults,
    addToast 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('returns'); // 'returns' | 'settings'

  // Inspection Drawer State
  const [inspectingCase, setInspectingCase] = useState(null);
  const [inspectionDecision, setInspectionDecision] = useState('return_to_inventory');
  const [inspectionNotes, setInspectionNotes] = useState('Weight matched declared 122.0g. Hallmark touch 92.5% verified on touchstone.');

  // Settings State
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const handleInspectionSubmit = (e) => {
    e.preventDefault();
    if (!inspectingCase) return;

    processReturnInspection(inspectingCase.id, inspectionDecision, inspectionNotes);
    setInspectingCase(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E3D9CC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-[#5C1D27] text-white rounded">
              Screen 5 • Returns & Parameters
            </span>
            <span className="text-xs text-gray-500 font-medium">Quality Inspection & Demo Configuration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1614] mt-1">
            Returns, Item Inspection & Showroom Settings
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Conduct silversmith bench inspections on returned pieces, decide restock eligibility, and configure showroom reservation policies.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#EFE8DD] p-1 rounded-xl text-xs self-start sm:self-center">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'returns' 
                ? 'bg-[#5C1D27] text-white shadow-sm' 
                : 'text-gray-700 hover:text-black'
            }`}
          >
            Inspection & Returns Queue ({returns.filter(r => r.currentStep !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'settings' 
                ? 'bg-[#5C1D27] text-white shadow-sm' 
                : 'text-gray-700 hover:text-black'
            }`}
          >
            Showroom Policies & Settings
          </button>
        </div>
      </div>

      {activeTab === 'returns' ? (
        /* TAB 1: RETURNS & CANCELLATIONS QUEUE */
        <div className="space-y-6">
          {/* Important Workflow Banner */}
          <div className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm">
            <h4 className="font-serif font-bold text-sm text-[#1C1614] mb-1">
              Quality Inspection & Restock Protocol
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 pt-1">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                <span className="font-bold text-purple-900 block mb-0.5">1. Pre-Dispatch Cancellations</span>
                <p className="text-[11px] text-purple-800">
                  Item never left the vault. Stock returns directly to <strong>Available</strong> with no assay or melting fee.
                </p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-0.5">2. Post-Delivery Returns</span>
                <p className="text-[11px] text-amber-800">
                  Mandatory bench inspection: Gross/net weight check, hallmark seal verification, and restock vs melting decision.
                </p>
              </div>
            </div>
          </div>

          {/* Cases Queue Table */}
          <div className="bg-white border border-[#E3D9CC] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E8DFD3] flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                Active Return & Cancellation Cases
              </h3>
              <span className="text-xs text-gray-500 font-mono">
                {returns.length} total logged cases
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFEB] text-[#4A3F39] border-b border-[#E3D9CC] font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Case & Order ID</th>
                    <th className="py-3 px-3">Customer & Location</th>
                    <th className="py-3 px-3">Item Specs</th>
                    <th className="py-3 px-3">Request Type & Reason</th>
                    <th className="py-3 px-3">Inspection Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {returns.map(retCase => {
                    const isPreDispatch = retCase.type === 'cancellation_pre_dispatch';
                    const isResolved = retCase.currentStep === 'resolved';

                    return (
                      <tr key={retCase.id} className="hover:bg-[#FAF7F2] transition">
                        {/* Case ID */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-gray-900 block">{retCase.id}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{retCase.orderId}</span>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-gray-900">{retCase.customerName}</div>
                          <span className="text-[10px] text-gray-500 block">{retCase.shippingOrigin}</span>
                        </td>

                        {/* Item */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <img 
                              src={retCase.productImage} 
                              alt={retCase.productName} 
                              className="w-10 h-10 object-cover rounded-lg border flex-shrink-0"
                            />
                            <div className="min-w-0 max-w-[170px]">
                              <span className="text-[9px] font-mono uppercase text-[#5C1D27] bg-[#5C1D27]/10 px-1 py-0.2 rounded font-bold">
                                {retCase.productSku}
                              </span>
                              <p className="font-semibold text-gray-800 truncate text-[11px] mt-0.5">
                                {retCase.productName}
                              </p>
                              <span className="text-[10px] font-serif font-bold text-gray-500">
                                {retCase.price}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="py-3 px-3 max-w-[220px]">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-1 ${
                            isPreDispatch ? 'bg-purple-100 text-purple-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {isPreDispatch ? 'Pre-Dispatch Cancel' : 'Post-Delivery Return'}
                          </span>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-tight">
                            {retCase.reason}
                          </p>
                        </td>

                        {/* Inspection Status */}
                        <td className="py-3 px-3">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                            isResolved ? 'bg-emerald-100 text-emerald-900' : 'bg-sky-100 text-sky-900'
                          }`}>
                            {retCase.inspectionStatus}
                          </span>
                          <span className="block text-[10px] text-gray-400 mt-0.5">
                            {retCase.weightVerification}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          {!isResolved ? (
                            <button
                              onClick={() => {
                                setInspectingCase(retCase);
                                setInspectionNotes(retCase.staffNotes || 'Bench inspection conducted by silversmith.');
                              }}
                              className="px-3 py-1.5 bg-[#5C1D27] hover:bg-[#44131B] text-white rounded-xl text-xs font-bold shadow-sm"
                            >
                              Conduct Inspection
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: SHOWROOM & E-COMMERCE DEMO SETTINGS */
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm mb-0.5">Client Feedback & Policy Configuration Area</strong>
              <p className="leading-relaxed">
                All values shown below are interactive demo parameters. During client discussions, showroom management can modify the hold hours, free shipping limits, and return terms before production rollout.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setting Box 1: Reservation Hold Rules */}
            <div className="bg-white border border-[#E3D9CC] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Clock className="w-4 h-4 text-[#5C1D27]" />
                <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                  Online Reservation Hold Parameters
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Standard Customer Hold Window (Hours) *
                  </label>
                  <input
                    type="number"
                    value={settingsForm.reservationHoldHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, reservationHoldHours: parseInt(e.target.value, 10) || 24 })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Duration a unique piece remains locked from duplicate booking before staff follow-up.
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Allow Staff Hold Extension (+Hours)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.allowHoldExtensionHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, allowHoldExtensionHours: parseInt(e.target.value, 10) || 24 })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    High-Value Owner Clearance Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.requireOwnerApprovalAbove}
                    onChange={(e) => setSettingsForm({ ...settingsForm, requireOwnerApprovalAbove: parseInt(e.target.value, 10) || 200000 })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Orders above this amount require owner/manager PIN before dispatch.
                  </span>
                </div>
              </div>
            </div>

            {/* Setting Box 2: Delivery & Shipping Matrix */}
            <div className="bg-white border border-[#E3D9CC] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <SlidersHorizontal className="w-4 h-4 text-[#5C1D27]" />
                <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                  Insured Delivery Fee Rules
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Free Insured Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.deliveryRules?.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      deliveryRules: { ...settingsForm.deliveryRules, freeShippingThreshold: parseInt(e.target.value, 10) || 10000 }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Standard Courier Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.deliveryRules?.baseDeliveryFee}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      deliveryRules: { ...settingsForm.deliveryRules, baseDeliveryFee: parseInt(e.target.value, 10) || 150 }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Showroom Counter Address for Customer Pickups
                  </label>
                  <input
                    type="text"
                    value={settingsForm.deliveryRules?.pickupShowroomAddress}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      deliveryRules: { ...settingsForm.deliveryRules, pickupShowroomAddress: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Setting Box 3: Return & Exchange Terms */}
            <div className="bg-white border border-[#E3D9CC] rounded-2xl p-5 shadow-sm space-y-4 md:col-span-2">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <FileCheck className="w-4 h-4 text-[#5C1D27]" />
                <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                  Return & Exchange Policy Terms (Demo Template)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Eligible Return Window (Days)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.returnPolicy?.returnWindowDays}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      returnPolicy: { ...settingsForm.returnPolicy, returnWindowDays: parseInt(e.target.value, 10) || 7 }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Silver Deduction / Restock Rule
                  </label>
                  <input
                    type="text"
                    value={settingsForm.returnPolicy?.silverDeductionRate}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      returnPolicy: { ...settingsForm.returnPolicy, silverDeductionRate: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Gold Hallmark Value Terms
                  </label>
                  <input
                    type="text"
                    value={settingsForm.returnPolicy?.goldExchangeTerms}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      returnPolicy: { ...settingsForm.returnPolicy, goldExchangeTerms: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E3D9CC]">
            <button
              type="button"
              onClick={resetToDemoDefaults}
              className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Reset All Demo Parameters
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#5C1D27] hover:bg-[#44131B] text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              <span>Save Demo Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Return Inspection Modal / Drawer */}
      {inspectingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-xl w-full shadow-2xl border border-[#C5A059]/40 overflow-hidden flex flex-col">
            <div className="bg-[#5C1D27] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Silversmith Bench Inspection & Restock Decision
                </h3>
              </div>
              <button 
                onClick={() => setInspectingCase(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInspectionSubmit} className="p-6 space-y-4 text-xs text-[#2C2420]">
              <div className="p-3 bg-white rounded-xl border border-[#E3D9CC] flex items-center gap-3">
                <img 
                  src={inspectingCase.productImage} 
                  alt={inspectingCase.productName} 
                  className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                />
                <div>
                  <span className="font-mono font-bold text-[10px] text-[#5C1D27] bg-[#5C1D27]/10 px-1.5 py-0.2 rounded">
                    {inspectingCase.productSku}
                  </span>
                  <h4 className="font-bold text-gray-900 mt-0.5">{inspectingCase.productName}</h4>
                  <p className="text-gray-500 font-serif font-bold">{inspectingCase.price}</p>
                </div>
              </div>

              {/* Decision Choice */}
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-700 mb-2">
                  Select Inspection Outcome *
                </label>
                <div className="space-y-2">
                  <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    inspectionDecision === 'return_to_inventory' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold' : 'border-gray-200 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="decision"
                      value="return_to_inventory"
                      checked={inspectionDecision === 'return_to_inventory'}
                      onChange={() => setInspectionDecision('return_to_inventory')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-600"
                    />
                    <div>
                      <span className="block font-bold">1. Return to Available Showroom & Online Inventory</span>
                      <span className="text-[10px] text-gray-500 font-normal">Piece is pristine, seal and weight verified. Restores status to 'Available'.</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    inspectionDecision === 'mark_damaged' ? 'border-rose-600 bg-rose-50 text-rose-950 font-semibold' : 'border-gray-200 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="decision"
                      value="mark_damaged"
                      checked={inspectionDecision === 'mark_damaged'}
                      onChange={() => setInspectionDecision('mark_damaged')}
                      className="mt-0.5 text-rose-600 focus:ring-rose-600"
                    />
                    <div>
                      <span className="block font-bold">2. Mark Unavailable / Send to Refinery Melting</span>
                      <span className="text-[10px] text-gray-500 font-normal">Seal broken or metal tarnished. Piece is removed from saleable inventory.</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    inspectionDecision === 'escalate_owner' ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold' : 'border-gray-200 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="decision"
                      value="escalate_owner"
                      checked={inspectionDecision === 'escalate_owner'}
                      onChange={() => setInspectionDecision('escalate_owner')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-600"
                    />
                    <div>
                      <span className="block font-bold">3. Escalate for Owner / Managing Director Review</span>
                      <span className="text-[10px] text-gray-500 font-normal">Requires senior executive sign-off before refund release.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bench Notes */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Master Goldsmith / Inspector Bench Notes
                </label>
                <textarea
                  rows={2}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E8DFD3]">
                <button
                  type="button"
                  onClick={() => setInspectingCase(null)}
                  className="px-4 py-2 rounded-xl border text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5C1D27] text-white font-bold shadow"
                >
                  Commit Inspection Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
