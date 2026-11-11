import { buildApiUrl } from './config.js';

/**
 * Loads Razorpay Checkout.js script dynamically if not already available on window.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Fetch public payment config (Key ID, Currency) from backend.
 */
export async function fetchPaymentConfig() {
  try {
    const res = await fetch(buildApiUrl('/api/payments/config'));
    if (!res.ok) throw new Error('Failed to load payment configuration');
    return await res.json();
  } catch (err) {
    console.error('Error fetching payment config:', err);
    return {
      success: true,
      key_id: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TvfYV6HvLgpuaI',
      currency: 'INR',
    };
  }
}

/**
 * Initialize gateway credentials for an already placed order.
 */
export async function createGatewayPayment(orderNumber) {
  const url = buildApiUrl('/api/payments/create');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order_number: orderNumber }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail?.error || data?.detail || data?.message || 'Failed to initialize payment gateway');
  }
  return data;
}

/**
 * Direct payment order creation (e.g. from cart drawer or instant buy).
 */
export async function createPaymentOrder(payload) {
  const url = buildApiUrl('/api/payments/create-order');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail?.error || data?.detail || data?.message || 'Failed to create payment order');
  }
  return data;
}

/**
 * Cryptographically verify payment signature on backend.
 */
export async function verifyPayment(verifyPayload) {
  const url = buildApiUrl('/api/payments/verify');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verifyPayload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail || data?.message || 'Payment signature verification failed');
  }
  return data;
}

/**
 * Convenience orchestrator: Loads checkout.js, triggers Razorpay modal,
 * and handles signature verification upon completion.
 */
export async function initiateRazorpayPayment({
  orderData,
  onSuccess,
  onError,
  onDismiss,
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    if (onError) onError(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    return;
  }

  const keyId = orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TvfYV6HvLgpuaI';

  const options = {
    key: keyId,
    amount: orderData.amount, // in paise
    currency: orderData.currency || 'INR',
    name: 'Vedha Radha Thangamaaligai',
    description: `Luxury Jewellery Order #${orderData.order_number}`,
    image: '/favicon.svg',
    order_id: orderData.razorpay_order_id,
    prefill: {
      name: orderData.customer?.name || '',
      email: orderData.customer?.email || '',
      contact: orderData.customer?.contact || '',
    },
    config: {
      display: {
        blocks: {
          upi_block: {
            name: 'Pay Using UPI (GPay / PhonePe / Paytm / QR)',
            instruments: [
              {
                method: 'upi',
              },
            ],
          },
          other_block: {
            name: 'Cards, Netbanking & Wallets',
            instruments: [
              {
                method: 'card',
              },
              {
                method: 'netbanking',
              },
              {
                method: 'wallet',
              },
            ],
          },
        },
        sequence: ['block.upi_block', 'block.other_block'],
        preferences: {
          show_default_blocks: true,
        },
      },
    },
    theme: {
      color: '#581923', // Signature royal maroon
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      },
    },
    handler: async function (response) {
      try {
        const verifyResult = await verifyPayment({
          order_number: orderData.order_number,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        if (onSuccess) onSuccess(verifyResult);
      } catch (err) {
        if (onError) onError(err);
      }
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', function (failResponse) {
    if (onError) onError(new Error(failResponse.error?.description || 'Payment was unsuccessful or cancelled.'));
  });
  rzp.open();
}

