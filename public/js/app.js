function showMessage(container, text, type) {
  type = type || 'success';
  const div = document.createElement('div');
  div.className = 'message ' + type;
  div.textContent = text;
  if (container && container.prepend) container.prepend(div);
  setTimeout(() => div.remove(), 3500);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderHeader(activePage) {
  activePage = activePage || '';
  const username = localStorage.getItem('username') || 'User';
  const navLinks = [
    ['dashboard.html', '📊 Dashboard'],
    ['customers.html', '👥 Customers'],
    ['devices.html', '💻 Devices'],
    ['services.html', '🔧 Services'],
    ['jobs.html', '📋 Repair Jobs'],
    ['payments.html', '💳 Payments']
  ];
  let navHtml = '';
  navLinks.forEach(function (item) {
    const cls = (activePage === item[0]) ? 'active' : '';
    navHtml += '<a href="' + item[0] + '" class="' + cls + '">' + item[1] + '</a>';
  });
  const html =
    '<header>' +
      '<h1>Computer Repair Shop</h1>' +
      '<div class="user-info">' +
        '<span>Welcome, <strong>' + username + '</strong></span>' +
        '<button onclick="logout()">🚪 Logout</button>' +
      '</div>' +
    '</header>' +
    '<nav>' + navHtml + '</nav>';
  const m = document.getElementById('app-header');
  if (m) m.innerHTML = html;
}