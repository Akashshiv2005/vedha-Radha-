import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_DELIVERIES,
  INITIAL_RETURNS_CASES, 
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS 
} from '../data/adminMockData';

const AdminContext = createContext(null);

const STORAGE_KEY = 'VEDA_RADHA_ADMIN_STATE_V1';

export function AdminProvider({ children }) {
  // Load initial or persisted state with safe defaults
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        let productsList = Array.isArray(parsed?.products) ? parsed.products : INITIAL_PRODUCTS;
        if (!productsList.some(p => p.sku === 'SA-001')) {
          productsList = [
            ...INITIAL_PRODUCTS,
            ...productsList.filter(p => !INITIAL_PRODUCTS.some(ip => ip.sku === p.sku))
          ];
        }
        let ordersList = Array.isArray(parsed?.orders) ? parsed.orders : INITIAL_ORDERS;
        if (!ordersList.some(o => o.orderNumber === 'VR-2024-00128' || o.id === 'VR-2024-00128')) {
          ordersList = [
            ...INITIAL_ORDERS,
            ...ordersList.filter(o => !INITIAL_ORDERS.some(io => io.orderNumber === o.orderNumber || io.id === o.id))
          ];
        }
        let deliveriesList = Array.isArray(parsed?.deliveries) && parsed.deliveries.length > 0 ? parsed.deliveries : INITIAL_DELIVERIES;
        if (!deliveriesList.some(d => d.orderNumber === 'VRJ-2025-0847')) {
          deliveriesList = INITIAL_DELIVERIES;
        }
        let returnsList = Array.isArray(parsed?.returns) && parsed.returns.length > 0 ? parsed.returns : INITIAL_RETURNS_CASES;
        if (!returnsList.some(r => r.id === 'RET-1008')) {
          returnsList = INITIAL_RETURNS_CASES;
        }
        let settingsObj = parsed?.settings && typeof parsed.settings === 'object' ? { ...INITIAL_SETTINGS, ...parsed.settings } : INITIAL_SETTINGS;
        return {
          products: productsList,
          orders: ordersList,
          deliveries: deliveriesList,
          returns: returnsList,
          settings: settingsObj,
          auditLogs: Array.isArray(parsed?.auditLogs) ? parsed.auditLogs : INITIAL_AUDIT_LOGS
        };
      }
    } catch (e) {
      console.warn('Failed to load local admin state:', e);
    }
    return {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      deliveries: INITIAL_DELIVERIES,
      returns: INITIAL_RETURNS_CASES,
      settings: INITIAL_SETTINGS,
      auditLogs: INITIAL_AUDIT_LOGS
    };
  });

  const [toasts, setToasts] = useState([]);
  const [conflictModalData, setConflictModalData] = useState(null); // When duplicate safeguard triggers

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist admin state:', e);
    }
  }, [state]);

  // Toast notification helper
  const addToast = (title, message, type = 'success', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, title, message, type, timestamp: new Date() };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Audit log helper
  const logAction = (action, description, user = 'Staff (Showroom Desk)', type = 'info') => {
    const now = new Date();
    const timeString = `Today ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeString,
      action,
      description,
      user,
      type
    };
    setState(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs.slice(0, 49)]
    }));
  };

  // --------------------------------------------------------------------------
  // INVENTORY & PRODUCT ACTIONS
  // --------------------------------------------------------------------------

  const addProduct = (productData) => {
    const newId = productData.sku || `VR-${productData.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newProduct = {
      ...productData,
      id: newId,
      sku: newId,
      status: productData.status || 'available',
      lastUpdated: 'Just now'
    };

    setState(prev => ({
      ...prev,
      products: [newProduct, ...prev.products]
    }));

    logAction('PRODUCT_ADDED', `New item "${newProduct.name}" (${newProduct.sku}) added to catalog.`, 'Staff', 'success');
    addToast('Product Added', `Added ${newProduct.name} (${newProduct.sku}) to inventory.`);
    return newProduct;
  };

  const updateProduct = (sku, updatedFields) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.sku === sku ? { ...p, ...updatedFields, lastUpdated: 'Just now' } : p)
    }));
    logAction('PRODUCT_UPDATED', `Product ${sku} details updated.`, 'Staff', 'info');
    addToast('Inventory Updated', `Saved changes for SKU ${sku}`);
  };

  const deleteProduct = (sku) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.sku !== sku)
    }));
    logAction('PRODUCT_DELETED', `Product ${sku} removed from catalog.`, 'Admin', 'warning');
    addToast('Product Removed', `SKU ${sku} deleted from inventory.`, 'info');
  };

  // CRITICAL BUSINESS SAFEGUARD: Mark Sold in Showroom
  // When a product (especially a 1-of-1 piece) is sold to a walk-in customer at the counter,
  // we immediately change status to 'sold_showroom' and block online reservations.
  // If there was an unconfirmed online reservation, we flag it and notify staff.
  const markProductSoldInShowroom = (sku, reason = 'Direct Walk-in Showroom Billing') => {
    const product = state.products.find(p => p.sku === sku);
    if (!product) return;

    // Check if there is an active reservation
    const pendingReservations = state.orders.filter(
      o => o.productSku === sku && ['awaiting_confirmation', 'reserved', 'new'].includes(o.status)
    );

    setState(prev => {
      // 1. Update product status
      const updatedProducts = prev.products.map(p => 
        p.sku === sku ? { ...p, status: 'sold_showroom', stockQty: Math.max(0, p.stockQty - 1), lastUpdated: 'Just now' } : p
      );

      // 2. If it was unique and had active reservations, update those orders
      const updatedOrders = prev.orders.map(o => {
        if (o.productSku === sku && ['awaiting_confirmation', 'reserved', 'new'].includes(o.status)) {
          return {
            ...o,
            status: 'cancelled',
            nextAction: 'Inform customer: Item purchased by in-store showroom buyer',
            notes: `${o.notes || ''} [AUTO-CANCELLED: Sold in Showroom Counter on ${new Date().toLocaleDateString()}]`,
            timeline: [
              {
                timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                event: `Reservation cancelled because unique piece was purchased in physical showroom.`,
                user: 'Showroom Counter POS Override'
              },
              ...(o.timeline || [])
            ]
          };
        }
        return o;
      });

      return {
        ...prev,
        products: updatedProducts,
        orders: updatedOrders
      };
    });

    logAction('SHOWROOM_SALE_LOCK', `Product ${sku} (${product.name}) marked SOLD IN SHOWROOM.`, 'Showroom POS', 'danger');
    
    if (pendingReservations.length > 0 && product.isUnique) {
      addToast(
        'Showroom Sale Overrode Online Hold', 
        `Unique piece ${sku} marked sold. ${pendingReservations.length} pending online reservation(s) were cancelled with notice.`, 
        'warning', 
        7000
      );
    } else {
      addToast('Marked Sold in Showroom', `${product.name} (${sku}) marked as Sold in Showroom.`);
    }
  };

  const releaseReservation = (sku, orderId = null) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.sku === sku ? { ...p, status: 'available', lastUpdated: 'Just now' } : p),
      orders: orderId ? prev.orders.map(o => o.id === orderId ? {
        ...o,
        status: 'cancelled',
        nextAction: 'Hold released — stock restored to available',
        timeline: [
          { timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, event: 'Staff released hold back to available showroom stock', user: 'Staff' },
          ...(o.timeline || [])
        ]
      } : o) : prev.orders
    }));

    logAction('HOLD_RELEASED', `Hold on item ${sku} released back to available inventory.`, 'Staff', 'info');
    addToast('Reservation Released', `Item ${sku} is now Available in showroom and online.`);
  };

  const markProductUnavailable = (sku, reason = 'Under Vault Maintenance / Inspection') => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.sku === sku ? { ...p, status: 'unavailable', lastUpdated: 'Just now' } : p)
    }));
    logAction('PRODUCT_UNAVAILABLE', `Item ${sku} marked unavailable (${reason}).`, 'Staff', 'warning');
    addToast('Status Updated', `Item ${sku} set to Unavailable.`);
  };

  // --------------------------------------------------------------------------
  // RESERVATION & ORDER WORKFLOW (WITH DUPLICATE SALE SAFEGUARD)
  // --------------------------------------------------------------------------

  // Core Safeguard Verification
  const createReservation = ({
    productSku,
    customerName,
    phone,
    email = '',
    city = 'Madurai',
    pincode = '625001',
    deliveryAddress = '',
    fulfilmentType = 'showroom_pickup',
    notes = '',
    isSimulated = true
  }) => {
    const product = state.products.find(p => p.sku === productSku);
    if (!product) {
      addToast('Error', 'Selected product was not found in catalog.', 'error');
      return { success: false, error: 'Product not found' };
    }

    // CHECK DUPLICATE SAFEGUARD FOR UNIQUE ITEMS
    if (product.isUnique && product.status !== 'available') {
      const activeHolder = state.orders.find(
        o => o.productSku === productSku && ['awaiting_confirmation', 'reserved', 'confirmed', 'processing', 'dispatched'].includes(o.status)
      );

      const conflictInfo = {
        product,
        activeHolder,
        attemptedBy: { customerName, phone, city, fulfilmentType },
        reason: product.status === 'sold_showroom' 
          ? 'This handcrafted 1-of-1 piece was ALREADY SOLD in the showroom.' 
          : 'This handcrafted 1-of-1 piece is CURRENTLY RESERVED by another customer.'
      };

      setConflictModalData(conflictInfo);
      logAction('SAFEGUARD_BLOCKED_DUPLICATE', `Blocked duplicate reservation attempt for unique piece ${product.sku} by ${customerName}.`, 'Safeguard Guardrail', 'danger');
      addToast('Duplicate Sale Blocked!', `Unique item ${product.sku} is already ${product.status}. Request was safely prevented.`, 'error', 6000);
      return { success: false, conflict: conflictInfo };
    }

    // CREATE NEW RESERVATION / ORDER
    const resId = `VR-RES-${Math.floor(8000 + Math.random() * 1999)}`;
    const newOrder = {
      id: resId,
      orderNumber: `#${resId.replace('VR-', '')}`,
      customerName,
      phone,
      email,
      city,
      pincode,
      deliveryAddress: deliveryAddress || `${city}, Tamil Nadu`,
      productSku: product.sku,
      productName: product.name,
      productPrice: product.price,
      numericPrice: product.numericPrice,
      productImage: product.image,
      isUniqueItem: product.isUnique,
      orderType: 'reservation',
      fulfilmentType,
      status: 'awaiting_confirmation',
      receivedAt: new Date().toISOString(),
      holdExpiresAt: new Date(Date.now() + (state.settings.reservationHoldHours || 24) * 60 * 60 * 1000).toISOString(),
      nextAction: 'Call customer to confirm viewing time & lock showroom piece',
      notes: notes || 'Online reservation via website/WhatsApp concierge.',
      tracking: {
        carrier: fulfilmentType === 'showroom_pickup' ? 'Showroom Counter Hold' : 'Sequel/BlueDart Logistics',
        trackingId: fulfilmentType === 'showroom_pickup' ? 'COUNTER-HOLD' : 'Pending Booking',
        dispatchedAt: null,
        deliveryStatus: fulfilmentType === 'showroom_pickup' ? 'Awaiting Showroom Visit' : 'Pending Dispatch'
      },
      timeline: [
        {
          timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          event: `${isSimulated ? '[Simulated Demo]' : 'Online'} customer reservation received`,
          user: 'Storefront Booking'
        },
        {
          timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          event: `Inventory lock applied: Status changed to Reserved (${state.settings.reservationHoldHours}h demo window)`,
          user: 'System Safeguard'
        }
      ]
    };

    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      products: prev.products.map(p => 
        p.sku === productSku 
          ? { ...p, status: 'reserved', lastUpdated: 'Just now' } 
          : p
      )
    }));

    logAction('RESERVATION_CREATED', `Reservation ${newOrder.orderNumber} created for ${customerName} (${product.sku}).`, 'Concierge', 'warning');
    addToast('Reservation Created & Locked!', `Safeguard active: ${product.name} is now locked from duplicate sales.`);
    return { success: true, order: newOrder };
  };

  const confirmReservation = (orderId) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? {
        ...o,
        status: 'reserved',
        nextAction: 'Awaiting customer showroom appointment / payment',
        timeline: [
          { timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, event: 'Staff verified customer phone & confirmed hold window', user: 'Staff' },
          ...(o.timeline || [])
        ]
      } : o)
    }));
    logAction('RESERVATION_CONFIRMED', `Staff verified and locked hold on order ${orderId}.`, 'Staff', 'success');
    addToast('Hold Confirmed', `Reservation ${orderId} confirmed and tagged in showroom system.`);
  };

  const extendHold = (orderId, hours = 24) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    const currentExpiry = order.holdExpiresAt ? new Date(order.holdExpiresAt) : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + hours * 60 * 60 * 1000).toISOString();

    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? {
        ...o,
        holdExpiresAt: newExpiry,
        nextAction: `Hold extended by ${hours}h — Follow up before new deadline`,
        timeline: [
          { timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, event: `Staff extended reservation hold by +${hours} hours (Demo setting)`, user: 'Staff' },
          ...(o.timeline || [])
        ]
      } : o)
    }));

    logAction('HOLD_EXTENDED', `Reservation ${orderId} extended by +${hours} hours.`, 'Staff', 'info');
    addToast('Hold Extended', `Hold for ${order.customerName} extended by ${hours} hours.`);
  };

  const rejectReservation = (orderId, reason = 'Customer did not confirm showroom appointment') => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? {
        ...o,
        status: 'cancelled',
        nextAction: 'Cancelled — Stock released to available',
        notes: `${o.notes || ''} [REJECTED: ${reason}]`,
        timeline: [
          { timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, event: `Reservation rejected: ${reason}`, user: 'Staff' },
          ...(o.timeline || [])
        ]
      } : o),
      // If unique product, release it back to available
      products: prev.products.map(p => 
        (p.sku === order.productSku && p.status === 'reserved')
          ? { ...p, status: 'available', lastUpdated: 'Just now' }
          : p
      )
    }));

    logAction('RESERVATION_REJECTED', `Reservation ${orderId} cancelled. Item ${order.productSku} restored to Available.`, 'Staff', 'warning');
    addToast('Hold Released', `Reservation cancelled. ${order.productSku} is now available again.`);
  };

  const convertReservationToOrder = (orderId) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    const newOrderNumber = `#ORD-${order.id.replace(/[^0-9]/g, '')}`;

    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? {
        ...o,
        orderType: 'direct_order',
        orderNumber: newOrderNumber,
        status: 'processing',
        nextAction: 'Move piece to secure dispatch packing desk',
        timeline: [
          { timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, event: `Reservation converted to confirmed order (${newOrderNumber})`, user: 'Billing Counter' },
          ...(o.timeline || [])
        ]
      } : o),
      products: prev.products.map(p => 
        p.sku === order.productSku ? { ...p, status: 'sold_online', lastUpdated: 'Just now' } : p
      )
    }));

    logAction('ORDER_CONVERTED', `Reservation ${orderId} converted to confirmed order ${newOrderNumber}.`, 'Billing Desk', 'success');
    addToast('Converted to Confirmed Order', `Order ${newOrderNumber} created and moved to Packing queue.`);
  };

  const updateOrderStatus = (orderId, newStatus, extraData = {}) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => {
        if (o.id !== orderId) return o;
        const timeline = [
          { 
            timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 
            event: extraData.logMessage || `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}`, 
            user: extraData.user || 'Staff' 
          },
          ...(o.timeline || [])
        ];
        return {
          ...o,
          status: newStatus,
          nextAction: extraData.nextAction || o.nextAction,
          tracking: extraData.tracking ? { ...o.tracking, ...extraData.tracking } : o.tracking,
          timeline
        };
      })
    }));

    logAction('ORDER_STATUS_UPDATE', `Order ${orderId} status set to ${newStatus}.`, 'Staff', 'info');
    addToast('Status Updated', `Order ${orderId} updated to ${newStatus.replace('_', ' ')}.`);
  };

  const updateTracking = (orderId, { carrier, trackingId, notes = '' }) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: 'dispatched',
          nextAction: `In Transit via ${carrier} (${trackingId}) — Monitor scans`,
          notes: notes ? `${o.notes || ''} [Tracking Note: ${notes}]` : o.notes,
          tracking: {
            ...o.tracking,
            carrier: carrier || o.tracking.carrier,
            trackingId: trackingId || o.tracking.trackingId,
            dispatchedAt: new Date().toISOString(),
            deliveryStatus: `Dispatched with ${carrier}`
          },
          timeline: [
            { 
              timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 
              event: `Dispatched via ${carrier}. AWB/Tracking: ${trackingId}`, 
              user: 'Logistics Desk' 
            },
            ...(o.timeline || [])
          ]
        };
      })
    }));

    logAction('ORDER_DISPATCHED', `Order ${orderId} dispatched with ${carrier} (${trackingId}).`, 'Logistics Desk', 'success');
    addToast('Dispatched with Tracking', `Consignment ${trackingId} booked with ${carrier}.`);
  };

  // --------------------------------------------------------------------------
  // DELIVERY & LOGISTICS DISPATCH ACTIONS (REFERENCE UI COMPLIANT)
  // --------------------------------------------------------------------------

  const updateDeliveryTracking = (orderNumber, { courier, trackingId, status, checkpointNote = '', issueDetails = '' }) => {
    setState(prev => ({
      ...prev,
      deliveries: (prev.deliveries || []).map(d => {
        if (d.orderNumber !== orderNumber) return d;
        const nowStr = `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const timelineEvent = checkpointNote 
          ? `Checkpoint: ${checkpointNote} (${courier || d.courier})` 
          : `Tracking updated: ${courier || d.courier} • ${trackingId || d.trackingId}`;
        const newTimeline = [
          { timestamp: nowStr, event: timelineEvent, user: 'Logistics Desk' },
          ...(d.timeline || [])
        ];
        return {
          ...d,
          courier: courier || d.courier,
          trackingId: trackingId || d.trackingId,
          status: status || d.status,
          issueDetails: status === 'Service Issues' ? (issueDetails || d.issueDetails) : undefined,
          timeline: newTimeline
        };
      })
    }));

    logAction('DELIVERY_TRACKING_UPDATE', `Consignment for ${orderNumber} updated (${courier} - ${trackingId}).`, 'Logistics Desk', 'info');
    addToast('Tracking Updated', `Saved shipment updates for order ${orderNumber}.`);
  };

  const updateDeliveryStatus = (orderNumber, newStatus, note = '') => {
    setState(prev => ({
      ...prev,
      deliveries: (prev.deliveries || []).map(d => {
        if (d.orderNumber !== orderNumber) return d;
        const nowStr = `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const eventText = note ? `Status changed to ${newStatus}: ${note}` : `Status changed to ${newStatus}`;
        return {
          ...d,
          status: newStatus,
          deliveredAt: newStatus === 'Delivered' 
            ? `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
            : d.deliveredAt,
          issueDetails: newStatus === 'Service Issues' ? (note || d.issueDetails) : (newStatus === 'Delivered' ? undefined : d.issueDetails),
          timeline: [
            { timestamp: nowStr, event: eventText, user: 'Logistics Supervisor' },
            ...(d.timeline || [])
          ]
        };
      })
    }));

    logAction('DELIVERY_STATUS_CHANGED', `Consignment ${orderNumber} marked ${newStatus}.`, 'Logistics Desk', 'info');
    addToast('Status Updated', `Order ${orderNumber} set to "${newStatus}".`);
  };

  const createDispatch = (dispatchData) => {
    const newDelivery = {
      id: `DEL-${Date.now().toString().slice(-4)}`,
      orderNumber: dispatchData.orderNumber || `VRJ-2025-${Math.floor(800 + Math.random() * 199)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerName: dispatchData.customerName,
      phone: dispatchData.phone,
      destination: dispatchData.destination,
      pincode: dispatchData.pincode || '600001',
      courier: dispatchData.courier || 'Blue Dart',
      trackingId: dispatchData.trackingId || `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      status: dispatchData.status || 'Ready to Dispatch',
      itemsSummary: dispatchData.itemsSummary || 'Showroom Jewellery Parcel',
      itemPrice: dispatchData.itemPrice || '₹ 45,000',
      timeline: [
        { 
          timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 
          event: `Dispatch consignment created and booked with ${dispatchData.courier || 'Blue Dart'}`, 
          user: 'Logistics Desk' 
        }
      ]
    };

    setState(prev => ({
      ...prev,
      deliveries: [newDelivery, ...(prev.deliveries || [])]
    }));

    logAction('DISPATCH_CREATED', `New dispatch consignment ${newDelivery.orderNumber} booked with ${newDelivery.courier}.`, 'Logistics Desk', 'success');
    addToast('Dispatch Created', `Consignment ${newDelivery.orderNumber} successfully registered.`);
    return newDelivery;
  };

  const deleteDispatch = (orderNumber) => {
    setState(prev => ({
      ...prev,
      deliveries: (prev.deliveries || []).filter(d => d.orderNumber !== orderNumber)
    }));
    logAction('DISPATCH_DELETED', `Dispatch record for ${orderNumber} cancelled.`, 'Logistics Desk', 'warning');
    addToast('Consignment Removed', `Removed ${orderNumber} from dispatch list.`, 'info');
  };

  // --------------------------------------------------------------------------
  // RETURNS, CANCELLATION & INSPECTION DECISIONS
  // --------------------------------------------------------------------------

  const processReturnInspection = (caseId, outcome, notes = '') => {
    // outcome: 'return_to_inventory' | 'mark_damaged' | 'escalate_owner'
    const returnCase = state.returns.find(r => r.id === caseId);
    if (!returnCase) return;

    let nextStatusText = '';
    let productStatusChange = null;

    if (outcome === 'return_to_inventory') {
      nextStatusText = 'Approved & Restocked — Item returned to Available stock';
      productStatusChange = 'available';
    } else if (outcome === 'mark_damaged') {
      nextStatusText = 'Rejected / Damaged — Sent to Refinery / Melting Safe';
      productStatusChange = 'unavailable';
    } else {
      nextStatusText = 'Escalated to Managing Director for Purity & Seal Resolution';
    }

    setState(prev => {
      // 1. Update return case
      const updatedReturns = prev.returns.map(r => {
        if (r.id !== caseId) return r;
        return {
          ...r,
          currentStep: outcome === 'escalate_owner' ? 'staff_review' : 'resolved',
          inspectionStatus: nextStatusText,
          staffNotes: `${r.staffNotes || ''} [INSPECTION OUTCOME: ${outcome.toUpperCase()} - ${notes}]`,
          timeline: [
            { 
              timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 
              event: `Inspection completed: ${nextStatusText}. Notes: ${notes}`, 
              user: 'Master Goldsmith / Quality Inspector' 
            },
            ...(r.timeline || [])
          ]
        };
      });

      // 2. If outcome changes product inventory, update products
      let updatedProducts = prev.products;
      if (productStatusChange) {
        updatedProducts = prev.products.map(p => 
          p.sku === returnCase.productSku 
            ? { ...p, status: productStatusChange, stockQty: productStatusChange === 'available' ? (p.stockQty || 1) : 0, lastUpdated: 'Just now' } 
            : p
        );
      }

      return {
        ...prev,
        returns: updatedReturns,
        products: updatedProducts
      };
    });

    logAction('INSPECTION_COMPLETED', `Return Case ${caseId} (${returnCase.productSku}) processed: ${outcome}.`, 'Quality Desk', outcome === 'return_to_inventory' ? 'success' : 'warning');
    addToast('Inspection Processed', `Case ${caseId}: ${nextStatusText}`);
  };

  const updateReturnStatus = (returnId, newStatus, nextAction = '', note = '') => {
    setState(prev => ({
      ...prev,
      returns: (prev.returns || []).map(r => {
        if (r.id !== returnId) return r;
        const nowStr = `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        return {
          ...r,
          status: newStatus,
          nextAction: nextAction || r.nextAction,
          timeline: [
            { timestamp: nowStr, event: note || `Status updated to ${newStatus}`, user: 'Staff' },
            ...(r.timeline || [])
          ]
        };
      })
    }));
    logAction('RETURN_STATUS_UPDATE', `Return case ${returnId} updated to ${newStatus}.`, 'Staff', 'info');
    addToast('Return Updated', `Case ${returnId} marked as ${newStatus}.`);
  };

  // --------------------------------------------------------------------------
  // SETTINGS & DEMO RESET
  // --------------------------------------------------------------------------

  const updateSettings = (newSettings) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
    logAction('SETTINGS_UPDATED', 'Showroom e-commerce demo parameters updated.', 'Admin', 'info');
    addToast('Settings Saved', 'Demo parameters updated (Pending client final sign-off).');
  };

  const resetToDemoDefaults = () => {
    setState({
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      deliveries: INITIAL_DELIVERIES,
      returns: INITIAL_RETURNS_CASES,
      settings: INITIAL_SETTINGS,
      auditLogs: INITIAL_AUDIT_LOGS
    });
    localStorage.removeItem(STORAGE_KEY);
    addToast('Demo State Reset', 'Restored pristine sample data for demonstration.', 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        products: state.products,
        orders: state.orders,
        deliveries: state.deliveries || INITIAL_DELIVERIES,
        returns: state.returns,
        settings: state.settings,
        auditLogs: state.auditLogs,
        toasts,
        conflictModalData,
        setConflictModalData,
        addToast,
        removeToast,
        logAction,
        addProduct,
        updateProduct,
        deleteProduct,
        markProductSoldInShowroom,
        releaseReservation,
        markProductUnavailable,
        createReservation,
        confirmReservation,
        extendHold,
        rejectReservation,
        convertReservationToOrder,
        updateOrderStatus,
        updateTracking,
        updateDeliveryTracking,
        updateDeliveryStatus,
        createDispatch,
        deleteDispatch,
        processReturnInspection,
        updateReturnStatus,
        updateSettings,
        resetToDemoDefaults
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
