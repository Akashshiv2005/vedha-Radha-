import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Navigation, 
  Package, 
  ExternalLink,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDeliveryPage() {
  const { orders, settings, updateOrderStatus, updateTracking, addToast } = useAdmin();

  // Pincode Serviceability Tool State
  const [testPincode, setTestPincode] = useState('600001');
  const [pincodeResult, setPincodeResult] = useState(null);

  // Delivery filter
  const [deliveryFilter, setDeliveryFilter] = useState('all'); // 'all' | 'awaiting_dispatch' | 'in_transit' | 'delivered'

  // Dispatch Queue items
  const awaitingDispatch = orders.filter(o => ['processing', 'confirmed'].includes(o.status));
  const inTransit = orders.filter(o => o.status === 'dispatched');
  const delivered = orders.filter(o => o.status === 'delivered');

  const checkPincodeServiceability = (e) => {
    e.preventDefault();
    const pin = testPincode.trim();
    if (!pin || pin.length < 6) return;

    const pinNum = parseInt(pin, 10);

    if (pinNum >= 600001 && pinNum <= 600130) {
      setPincodeResult({
        status: 'serviceable_express',
        zone: 'Zone A - Greater Chennai Metro & Suburbs',
        sla: 'Same-Day / Next-Day Showroom Hand-Delivery',
        fee: 'Free above ₹5,000 (Standard: ₹150)',
        carriers: ['Showroom Express Messenger', 'BlueDart Apex Gold Secure'],
        message: 'Fully serviceable with insured delivery & OTP verification.'
      });
    } else if (pinNum >= 620001 && pinNum <= 643000) {
      setPincodeResult({
        status: 'serviceable_standard',
        zone: 'Zone B - Tamil Nadu Tier 1 & 2 Cities (Madurai, Trichy, CBE, Salem)',
        sla: '24 - 48 Hours Insured Armoured Transit',
        fee: 'Free above ₹10,000 (Standard: ₹150)',
        carriers: ['BlueDart Apex Gold Secure', 'Sequel Secured Cargo'],
        message: 'Serviceable under regular insured jewellery shipping route.'
      });
    } else if (pinNum >= 560001 && pinNum <= 580000) {
      setPincodeResult({
        status: 'serviceable_regional',
        zone: 'Zone C - South India Hubs (Bengaluru, Hyderabad, Kochi)',
        sla: '2 - 3 Working Days High-Value Logistics',
        fee: '₹ 350 Flat Secured Transit',
        carriers: ['Sequel Logistics', 'BlueDart Dedicated Air Express'],
        message: 'Serviceable with specialized high-value jewellery insurance mandate.'
      });
    } else {
      setPincodeResult({
        status: 'review_required',
        zone: 'Zone D - Extended Outstation / Remote Rural Area',
        sla: 'Staff Manual Assessment Required',
        fee: 'Custom Insured Freight Quote',
        carriers: ['Special Escort Logistics / Speed Post Insured'],
        message: 'Location outside standard auto-coverage. Staff must verify delivery security before accepting payment.',
        alternatives: ['Arrange Showroom Counter Pickup with VIP Concierge', 'Request Manager Clearance for Insured High-Value Courier']
      });
    }
  };

  const handleSimulateCall = (phone, name) => {
    addToast('Call Initiated (Demo)', `Simulating phone call with ${name} (${phone}) for delivery coordination.`, 'info');
  };

  const handleSimulateWhatsApp = (phone, name) => {
    addToast('WhatsApp Sent (Demo)', `Dispatched dispatch tracking link to ${name} (${phone}).`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E3D9CC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-[#5C1D27] text-white rounded">
              Screen 4 • Logistics & Serviceability
            </span>
            <span className="text-xs text-gray-500 font-medium">Secured Jewellery Transit Operations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1614] mt-1">
            Delivery Operations & Regional Serviceability
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Monitor high-value insured dispatches, test PIN serviceability, and coordinate doorstep delivery or showroom counter pickup.
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#C5A059]/50 px-3.5 py-2 rounded-xl text-xs text-[#7A5B20] font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Transit Insurance: 100% Guaranteed</span>
        </div>
      </div>

      {/* 4 Pipeline Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Awaiting Packing</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-purple-900">
            {awaitingDispatch.length} <span className="text-xs font-sans font-normal text-gray-500">orders</span>
          </div>
          <span className="text-[10px] text-purple-700 font-medium">Vault packing desk</span>
        </div>

        <div className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">In Transit</span>
            <Truck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-sky-900">
            {inTransit.length} <span className="text-xs font-sans font-normal text-gray-500">consignments</span>
          </div>
          <span className="text-[10px] text-sky-700 font-medium">Active carrier scans</span>
        </div>

        <div className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Delivered & Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-900">
            {delivered.length} <span className="text-xs font-sans font-normal text-gray-500">fulfilled</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">OTP verified receipt</span>
        </div>

        <div className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Delayed / Alert</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-900">
            0 <span className="text-xs font-sans font-normal text-gray-500">alerts</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">All transit on time</span>
        </div>
      </div>

      {/* Two Column Section: Left = Pincode Checker & Serviceability Map | Right = Active Logistics Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Pincode Checker & Service Area Visualizer */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Pincode Checker */}
          <div className="bg-[#FAF7F2] border border-[#E3D9CC] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5C1D27]" />
                <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                  Pincode Serviceability Lookup
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-[#EFE8DD] text-gray-700 px-2 py-0.5 rounded">
                Demo Engine
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Check delivery SLA, transit insurance terms, and shipping fees for any Indian pincode.
            </p>

            {/* Input Form */}
            <form onSubmit={checkPincodeServiceability} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={testPincode}
                onChange={(e) => setTestPincode(e.target.value)}
                placeholder="Enter 6-digit PIN (e.g. 600001)"
                className="flex-1 bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#5C1D27] hover:bg-[#44131B] text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Check
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="text-gray-400 self-center">Try PIN:</span>
              {[
                { label: 'Chennai (600028)', pin: '600028' },
                { label: 'Madurai (625001)', pin: '625001' },
                { label: 'Bengaluru (560001)', pin: '560001' },
                { label: 'Remote PIN (799001)', pin: '799001' }
              ].map(item => (
                <button
                  key={item.pin}
                  type="button"
                  onClick={() => {
                    setTestPincode(item.pin);
                    setTimeout(() => checkPincodeServiceability({ preventDefault: () => {} }), 50);
                  }}
                  className="px-2 py-0.5 bg-white border border-gray-300 rounded-lg hover:bg-[#FAF5EE] text-gray-700"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Pincode Lookup Result Card */}
            {pincodeResult && (
              <div className={`p-4 rounded-xl border animate-in fade-in space-y-2.5 text-xs ${
                pincodeResult.status.startsWith('serviceable')
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-[10px] tracking-wider bg-white/80 px-2 py-0.5 rounded shadow-sm">
                    {pincodeResult.zone}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    pincodeResult.status.startsWith('serviceable') ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {pincodeResult.status.startsWith('serviceable') ? 'Serviceable' : 'Manual Review Required'}
                  </span>
                </div>

                <div className="space-y-1">
                  <p><strong>Transit SLA:</strong> {pincodeResult.sla}</p>
                  <p><strong>Insured Shipping Fee:</strong> {pincodeResult.fee}</p>
                  <p><strong>Authorized Carriers:</strong> {pincodeResult.carriers.join(', ')}</p>
                </div>

                <p className="text-[11px] text-gray-700 pt-1 border-t border-black/10">
                  {pincodeResult.message}
                </p>

                {pincodeResult.alternatives && (
                  <div className="bg-white/90 p-2.5 rounded-lg border border-amber-300 text-[11px] space-y-1">
                    <strong className="text-amber-900 block font-semibold">Recommended Out-of-Area Fallbacks:</strong>
                    {pincodeResult.alternatives.map((alt, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-gray-800">
                        <ArrowRight className="w-3 h-3 text-[#5C1D27] flex-shrink-0" />
                        <span>{alt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Service Area Visualizer Panel */}
          <div className="bg-[#FAF7F2] border border-[#E3D9CC] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#9B7A38]" />
                <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                  Showroom Delivery Hubs & Zones
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400 italic">Sample Map Policy</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {settings.serviceZones?.map((z, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-[#E8DFD3] space-y-1">
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span className="text-xs">{z.zone}</span>
                    <span className="text-[10px] font-mono text-[#5C1D27] bg-[#5C1D27]/10 px-1.5 py-0.5 rounded">
                      {z.pincodes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-600">
                    <span>SLA: {z.sla}</span>
                    <span className="font-semibold text-emerald-800">{z.fee}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Client Configuration Notice:</strong> Delivery radii, free shipping thresholds (currently ₹{settings.deliveryRules?.freeShippingThreshold?.toLocaleString('en-IN')}), and insured courier tariffs are adjustable in Settings.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Active Consignments & Tracking Desk */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E3D9CC] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DFD3] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#5C1D27]" />
                  <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                    Shipment Tracking & Fulfilment Queue
                  </h3>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Update carrier status, dispatch dates, and customer delivery notes
                </p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DFD3] text-xs">
                {['all', 'in_transit', 'processing'].map(filterKey => (
                  <button
                    key={filterKey}
                    onClick={() => setDeliveryFilter(filterKey)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                      deliveryFilter === filterKey ? 'bg-[#5C1D27] text-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    {filterKey.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Consignment List */}
            <div className="space-y-3">
              {orders
                .filter(o => o.fulfilmentType === 'home_delivery' || o.status === 'dispatched')
                .filter(o => deliveryFilter === 'all' || (deliveryFilter === 'in_transit' && o.status === 'dispatched') || (deliveryFilter === 'processing' && o.status === 'processing'))
                .map(order => (
                  <div 
                    key={order.id} 
                    className="bg-[#FAF7F2] border border-[#E3D9CC] rounded-xl p-4 shadow-sm space-y-3"
                  >
                    {/* Top Row: Order ID, Status, Customer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD3] pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-gray-900">{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            order.status === 'dispatched' ? 'bg-sky-100 text-sky-800' :
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-800 mt-0.5 block">
                          Recipient: {order.customerName} • {order.city} ({order.pincode})
                        </span>
                      </div>

                      {/* Quick Contact Buttons */}
                      <div className="flex items-center gap-1.5 self-start sm:self-center">
                        <button
                          onClick={() => handleSimulateCall(order.phone, order.customerName)}
                          className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-[11px] font-medium flex items-center gap-1"
                          title="Call Customer"
                        >
                          <Phone className="w-3 h-3 text-emerald-700" />
                          <span>Call</span>
                        </button>
                        <button
                          onClick={() => handleSimulateWhatsApp(order.phone, order.customerName)}
                          className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-100 text-[11px] font-medium flex items-center gap-1"
                          title="Send WhatsApp Tracking Update"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Item & Tracking info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img 
                          src={order.productImage} 
                          alt={order.productName} 
                          className="w-12 h-12 object-cover rounded-xl border flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{order.productName}</p>
                          <p className="text-gray-500 font-serif font-bold text-[11px]">{order.productPrice}</p>
                          <span className="text-[10px] text-gray-400 block font-mono">SKU: {order.productSku}</span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-[11px] space-y-0.5">
                        <p><strong>Carrier:</strong> {order.tracking?.carrier || 'Sequel Logistics'}</p>
                        <p><strong>AWB / Consignment:</strong> <span className="font-mono text-[#5C1D27] font-bold">{order.tracking?.trackingId || 'Pending'}</span></p>
                        <p className="text-gray-500 text-[10px]">Checkpoint: {order.tracking?.deliveryStatus || 'Vault Custody'}</p>
                      </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8DFD3]">
                      <span className="text-[10px] text-gray-500 truncate max-w-xs">
                        Address: {order.deliveryAddress}
                      </span>

                      <div className="flex items-center gap-2">
                        {order.status === 'dispatched' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered', {
                              logMessage: 'Delivery verified by customer OTP'
                            })}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-bold shadow-sm"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'dispatched', {
                              logMessage: 'Order handed to courier partner'
                            })}
                            className="px-3 py-1 bg-sky-800 hover:bg-sky-900 text-white rounded-lg text-[11px] font-bold shadow-sm"
                          >
                            Mark Dispatched
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
