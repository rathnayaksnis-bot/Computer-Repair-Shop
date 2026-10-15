$(function () {
  requireAuth();
  renderHeader('customers.html');
  let editingId = null;

  function load(search) {
    $.ajax({
      url: '/api/customers?search=' + encodeURIComponent(search || ''),
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#customersTable tbody').empty();
        if (!rows.length) {
          tbody.append('<tr><td colspan="6" style="text-align:center;">No customers</td></tr>');
          return;
        }
        rows.forEach(c => {
          tbody.append(
            '<tr>' +
              '<td>' + c.id + '</td>' +
              '<td>' + escapeHtml(c.name) + '</td>' +
              '<td>' + escapeHtml(c.email) + '</td>' +
              '<td>' + escapeHtml(c.phone) + '</td>' +
              '<td>' + escapeHtml(c.address) + '</td>' +
              '<td>' +
                '<button class="btn warn edit-btn" data-id="' + c.id + '">Edit</button> ' +
                '<button class="btn danger delete-btn" data-id="' + c.id + '">Delete</button>' +
              '</td>' +
            '</tr>'
          );
        });
      }
    });
  }

  $(document).on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: '/api/customers/' + id,
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (c) {
        editingId = c.id;
        $('#name').val(c.name);
        $('#email').val(c.email);
        $('#phone').val(c.phone);
        $('#address').val(c.address);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  $(document).on('click', '.delete-btn', function () {
    if (!confirm('Delete this customer?')) return;
    $.ajax({
      url: '/api/customers/' + $(this).data('id'),
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: () => load($('#searchBox').val())
    });
  });

  $('#searchBox').on('input', function () { load($(this).val()); });

  $('#resetBtn').on('click', function () {
    editingId = null;
    $('#customerForm')[0].reset();
  });

  $('#customerForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      name: $('#name').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      address: $('#address').val()
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? '/api/customers/' + editingId : '/api/customers';
    $.ajax({
      url, method,
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: () => {
        showMessage($('#msg'), 'Customer saved!');
        editingId = null;
        $('#customerForm')[0].reset();
        load();
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  load();
});