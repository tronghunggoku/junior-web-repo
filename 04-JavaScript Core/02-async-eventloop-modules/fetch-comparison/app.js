const API_ENDPOINTS = [
  { id: 'user-profile', name: 'GET /api/v1/user/profile', delay: 350, fail: false },
  { id: 'user-orders', name: 'GET /api/v1/orders/history', delay: 750, fail: false },
  { id: 'notifications', name: 'GET /api/v1/notifications', delay: 250, fail: false },
  { id: 'recommendations', name: 'GET /api/v1/products/recommended', delay: 900, fail: true },
  { id: 'user-cart', name: 'GET /api/v1/cart/items', delay: 450, fail: false },
];

const btnSequential = document.getElementById('btnSequential');
const btnParallelAll = document.getElementById('btnParallelAll');
const btnParallelSettled = document.getElementById('btnParallelSettled');
const btnReset = document.getElementById('btnReset');
const btnClearLog = document.getElementById('btnClearLog');
const simulateErrorToggle = document.getElementById('simulateErrorToggle');

const timeSeqEl = document.getElementById('timeSeq');
const timeParEl = document.getElementById('timePar');
const speedupValEl = document.getElementById('speedupVal');
const speedupDescEl = document.getElementById('speedupDesc');

const statusSeqEl = document.getElementById('statusSeq');
const statusParEl = document.getElementById('statusPar');

const requestsContainer = document.getElementById('requestsContainer');
const logOutput = document.getElementById('logOutput');

let sequentialTime = 0;
let parallelTime = 0;

function renderRequestItems() {
  requestsContainer.innerHTML = API_ENDPOINTS.map((endpoint) => `
    <div class="request-item" id="req-${endpoint.id}">
      <div class="request-top">
        <span class="request-title">${endpoint.name}</span>
        <span class="request-meta" id="meta-${endpoint.id}">Độ trễ: ~${endpoint.delay}ms</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" id="prog-${endpoint.id}"></div>
      </div>
    </div>
  `).join('');
}

function appendLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('vi-VN', { hour12: false });
  const prefix = `[${timestamp}]`;
  const logLine = `${prefix} ${message}\n`;
  logOutput.textContent += logLine;
  logOutput.scrollTop = logOutput.scrollHeight;
}

function mockFetchApi(endpoint, shouldSimulateError = false) {
  const itemEl = document.getElementById(`req-${endpoint.id}`);
  const progEl = document.getElementById(`prog-${endpoint.id}`);
  const metaEl = document.getElementById(`meta-${endpoint.id}`);

  itemEl.className = 'request-item pending';
  metaEl.textContent = 'Đang tải...';

  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const duration = endpoint.delay;
    const interval = 20;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const percent = Math.min(100, Math.round((elapsed / duration) * 100));
      progEl.style.width = `${percent}%`;

      if (elapsed >= duration) {
        clearInterval(timer);
        const actualTime = Math.round(performance.now() - startTime);

        if (shouldSimulateError && endpoint.fail) {
          itemEl.className = 'request-item failed';
          metaEl.textContent = `Thất bại (500 Error - ${actualTime}ms)`;
          reject(new Error(`API ${endpoint.name} trả về lỗi HTTP 500`));
        } else {
          itemEl.className = 'request-item completed';
          metaEl.textContent = `Hoàn thành (${actualTime}ms)`;
          resolve({ endpoint: endpoint.name, data: { status: 'OK' }, time: actualTime });
        }
      }
    }, interval);
  });
}

function setButtonsState(disabled) {
  btnSequential.disabled = disabled;
  btnParallelAll.disabled = disabled;
  btnParallelSettled.disabled = disabled;
}

function updateSpeedupMetric() {
  if (sequentialTime > 0 && parallelTime > 0) {
    const speedup = (sequentialTime / parallelTime).toFixed(2);
    speedupValEl.textContent = `${speedup}x`;
    speedupDescEl.textContent = `Promise.all chạy nhanh hơn gấp ${speedup} lần so với fetch tuần tự.`;
  }
}

async function runSequentialFetch() {
  setButtonsState(true);
  renderRequestItems();
  statusSeqEl.className = 'status-tag status-running';
  statusSeqEl.textContent = 'Đang chạy...';
  timeSeqEl.innerHTML = `0.00 <small>ms</small>`;

  appendLog('Bắt đầu: Fetch tuần tự (for...of + await)...');
  const shouldError = simulateErrorToggle.checked;
  const start = performance.now();

  try {
    const results = [];
    for (const endpoint of API_ENDPOINTS) {
      appendLog(`  Bắt đầu gọi: ${endpoint.name}`);
      const data = await mockFetchApi(endpoint, shouldError);
      results.push(data);
      appendLog(`  Xong: ${endpoint.name} (${data.time}ms)`);
    }

    const totalTime = performance.now() - start;
    sequentialTime = totalTime;
    timeSeqEl.innerHTML = `${totalTime.toFixed(1)} <small>ms</small>`;
    statusSeqEl.className = 'status-tag status-success';
    statusSeqEl.textContent = 'Thành công';
    appendLog(`Hoàn tất tuần tự. Tổng thời gian: ${totalTime.toFixed(1)}ms`);
  } catch (error) {
    const totalTime = performance.now() - start;
    timeSeqEl.innerHTML = `${totalTime.toFixed(1)} <small>ms</small>`;
    statusSeqEl.className = 'status-tag status-error';
    statusSeqEl.textContent = 'Bị ngắt do lỗi';
    appendLog(`Lỗi trong quá trình chạy tuần tự: ${error.message}`);
  } finally {
    setButtonsState(false);
    updateSpeedupMetric();
  }
}

async function runParallelPromiseAll() {
  setButtonsState(true);
  renderRequestItems();
  statusParEl.className = 'status-tag status-running';
  statusParEl.textContent = 'Đang chạy...';
  timeParEl.innerHTML = `0.00 <small>ms</small>`;

  appendLog('Bắt đầu: Fetch song song với Promise.all()...');
  const shouldError = simulateErrorToggle.checked;
  const start = performance.now();

  try {
    appendLog(`  Đang gửi đồng thời ${API_ENDPOINTS.length} requests...`);
    const promises = API_ENDPOINTS.map((endpoint) => mockFetchApi(endpoint, shouldError));
    const results = await Promise.all(promises);

    const totalTime = performance.now() - start;
    parallelTime = totalTime;
    timeParEl.innerHTML = `${totalTime.toFixed(1)} <small>ms</small>`;
    statusParEl.className = 'status-tag status-success';
    statusParEl.textContent = 'Thành công';
    appendLog(`Hoàn tất Promise.all. Tổng thời gian: ${totalTime.toFixed(1)}ms`);
  } catch (error) {
    const totalTime = performance.now() - start;
    timeParEl.innerHTML = `${totalTime.toFixed(1)} <small>ms</small>`;
    statusParEl.className = 'status-tag status-error';
    statusParEl.textContent = 'Rejected';
    appendLog(`Promise.all bị reject: ${error.message}`);
  } finally {
    setButtonsState(false);
    updateSpeedupMetric();
  }
}

async function runParallelPromiseAllSettled() {
  setButtonsState(true);
  renderRequestItems();
  statusParEl.className = 'status-tag status-running';
  statusParEl.textContent = 'Đang chạy (Settled)...';

  appendLog('Bắt đầu: Fetch song song với Promise.allSettled()...');
  const shouldError = simulateErrorToggle.checked;
  const start = performance.now();

  const promises = API_ENDPOINTS.map((endpoint) => mockFetchApi(endpoint, shouldError));
  const results = await Promise.allSettled(promises);

  const totalTime = performance.now() - start;
  parallelTime = totalTime;
  timeParEl.innerHTML = `${totalTime.toFixed(1)} <small>ms</small>`;
  statusParEl.className = 'status-tag status-success';
  statusParEl.textContent = 'Hoàn tất (Settled)';

  const fulfilledCount = results.filter((r) => r.status === 'fulfilled').length;
  const rejectedCount = results.filter((r) => r.status === 'rejected').length;

  appendLog(`Hoàn tất Promise.allSettled. Thời gian: ${totalTime.toFixed(1)}ms | Thành công: ${fulfilledCount} | Thất bại: ${rejectedCount}`);

  setButtonsState(false);
  updateSpeedupMetric();
}

function resetBenchmark() {
  sequentialTime = 0;
  parallelTime = 0;
  timeSeqEl.innerHTML = `0.00 <small>ms</small>`;
  timeParEl.innerHTML = `0.00 <small>ms</small>`;
  speedupValEl.textContent = '0x';
  speedupDescEl.textContent = 'Hãy chạy cả 2 chế độ để so sánh tốc độ.';
  statusSeqEl.className = 'status-tag status-idle';
  statusSeqEl.textContent = 'Chưa chạy';
  statusParEl.className = 'status-tag status-idle';
  statusParEl.textContent = 'Chưa chạy';
  renderRequestItems();
  appendLog('Đã làm mới trạng thái kiểm thử.');
}

btnSequential.addEventListener('click', runSequentialFetch);
btnParallelAll.addEventListener('click', runParallelPromiseAll);
btnParallelSettled.addEventListener('click', runParallelPromiseAllSettled);
btnReset.addEventListener('click', resetBenchmark);
btnClearLog.addEventListener('click', () => { logOutput.textContent = ''; });

renderRequestItems();
appendLog('Sẵn sàng kiểm thử.');
