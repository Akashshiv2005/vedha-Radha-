import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9222', '--disable-gpu', '--no-sandbox']);
await new Promise(r => setTimeout(r, 1200));

async function runTest() {
  // 1. Get auth token
  const authRes = await fetch('http://localhost:5173/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin', password: 'admin@123' })
  });
  const authData = await authRes.json();
  const token = authData.token;
  console.log('Got Admin Auth Token:', token ? token.slice(0, 15) + '...' : 'NONE');

  // 2. Open Admin Page with Token in localStorage
  const tabRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:5173/admin', { method: 'PUT' });
  const tabData = await tabRes.json();
  const ws = new WebSocket(tabData.webSocketDebuggerUrl);
  const exceptions = [];
  const errors = [];
  let inventoryState = null;

  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
      // Set token before loading admin dashboard
      ws.send(JSON.stringify({
        id: 3,
        method: 'Runtime.evaluate',
        params: {
          expression: `localStorage.setItem('VEDA_RADHA_AUTH_TOKEN', '${token}'); location.reload();`
        }
      }));
    };

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        exceptions.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.id === 20) {
        inventoryState = msg.result?.result?.value;
      }
    };

    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 20,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const rows = Array.from(document.querySelectorAll('tbody tr'));
            const rowData = rows.map(r => ({
              sku: r.querySelector('td:nth-child(3)')?.innerText?.trim(),
              name: r.querySelector('td:nth-child(2) h4')?.innerText?.trim(),
              category: r.querySelector('td:nth-child(4)')?.innerText?.trim(),
              price: r.querySelector('td:nth-child(6)')?.innerText?.trim(),
              img: r.querySelector('td:nth-child(2) img')?.src
            }));
            return {
              title: document.title,
              activeTab: document.querySelector('.bg-\\\\[\\\\#8D6725\\\\]\\\\/10')?.innerText || 'Dashboard',
              totalRows: rows.length,
              rows: rowData.slice(0, 6),
              totalProductsText: document.querySelector('span.font-medium.text-\\\\[\\\\#292521\\\\]')?.innerText
            };
          })()`,
          returnByValue: true
        }
      }));
    }, 3500);

    setTimeout(() => {
      resolve();
    }, 4500);
  });

  ws.close();
  console.log('\n=== Authenticated Admin Inventory State ===');
  console.log('Exceptions:', exceptions.length);
  if (exceptions.length) console.log('Exceptions Detail:', exceptions);
  console.log('Console Errors:', errors.length);
  if (errors.length) console.log('Errors Detail:', errors);
  console.log('Inventory DOM Data:', JSON.stringify(inventoryState, null, 2));
}

try {
  await runTest();
} finally {
  chrome.kill();
  process.exit(0);
}
